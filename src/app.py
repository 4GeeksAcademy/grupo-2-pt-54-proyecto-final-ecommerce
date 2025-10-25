"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.vendors import vendors_bp
from api.admin import setup_admin
from api.commands import setup_commands
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from flask_cors import CORS
from sqlalchemy import select
from datetime import timedelta


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT"))
app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS")
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)

app.url_map.strict_slashes = False

# Allow CORS requests to this API
CORS(api)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(vendors_bp)

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route("/api/registro", methods=["POST"])
def handle_registro():
    body = request.get_json(silent=True)
    user_keys = ["first_name", "last_name", "email", "password", "role"]

    if body is None:
        return jsonify({"msg": "El body no puede estar vacio"}), 400
    elif sorted(user_keys) != sorted(list(body.keys())):
        return jsonify({"msg": f"El usuario debe contener las siguientes llaves: {user_keys}"}), 406
    user = db.session.execute(db.select(User).filter_by(
        email=body["email"])).scalar_one_or_none()
    if user:
        return jsonify({"msg": "El usuario ya existe"}), 409

    password = body.get("password")
    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    body["password"] = pw_hash

    new_user = User.create_user(body)

    token = create_access_token(
        identity=body["email"], expires_delta=timedelta(hours=1))
    # Use path parameter to match frontend route /verify/:token
    verify_link = f"{os.getenv('VITE_FRONTEND_URL')}/verify?token={token}"

    msg = Message("Verifica tu cuenta", recipients=[body["email"]])
    msg.body = f"Hola {body['first_name']}, por favor verifica tu cuenta dando click en el siguiente enlace: {verify_link}"
    mail.send(msg)

    if new_user:
        return jsonify({'msg': 'Usuario creado correctamente'}), 201

    return jsonify({"msg": "Error al crear el usuario"}), 500


@app.route('/api/verify/<token>', methods=["GET"])
def verify_user(token):
    try:
        data = decode_token(token)
        user = db.session.execute(db.select(User).filter_by(
            email=data["sub"])).scalar_one_or_none()
        if user:
            user.is_verified = True
            user.is_active = True
            db.session.commit()
            return jsonify({"msg": "El usuario ya ha sido verificado"}), 200
        return jsonify({"msg": "Usuario no encontrado"}), 404
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"msg": "Token invalido o expirado"}), 400


@app.route('/api/forgot', methods=["POST"])
def forgot_password():
    try:
        data = request.get_json(silent=True)
        email = data.get("email", None)
        if not email:
            return jsonify({"msg": "El correo es requerido"}), 400

        user = db.session.execute(db.select(User).filter_by(
            email=email)).scalar_one_or_none()
        token = create_access_token(
            identity=email, expires_delta=timedelta(hours=1))
        reset_link = f"{os.getenv('VITE_FRONTEND_URL')}/new-password?token={token}"

        msg = Message("Restablece tu contraseña", recipients=[email])
        msg.body = f"Hola, por favor restablece tu contraseña dando click en el siguiente enlace: {reset_link}"
        mail.send(msg)

        if user:
            return jsonify({"msg": "Correo de restablecimiento enviado"}), 200
        return jsonify({"msg": "Usuario no encontrado"}), 404
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la solicitud"}), 500


@app.route('/api/reset/<token>', methods=["PUT"])
def reset_password(token):
    try:
        decoded_data = decode_token(token)
        email = decoded_data["sub"]
        user = db.session.execute(db.select(User).filter_by(
            email=email)).scalar_one_or_none()

        data = request.get_json(silent=True)
        new_password = data.get("password", None)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        if not new_password:
            return jsonify({"msg": "La nueva contraseña es requerida"}), 400

        pw_hash = bcrypt.generate_password_hash(new_password).decode("utf-8")
        user.password = pw_hash
        db.session.commit()

        return jsonify({"msg": "Contraseña restablecida correctamente"}), 200
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la solicitud"}), 500


@app.route("/api/login", methods=["POST"])
def handle_login():
    body = request.get_json(silent=True)
    user_email = body.get("email", None)
    user_password = body.get("password", None)
    user = db.session.execute(db.select(User).filter_by(
        email=user_email)).scalar_one_or_none()
    print(user)

    if not user:
        return jsonify({"msg": "El usuario o contraseña es incorrecto"}), 401
    print(user.password)
    print(user_password)

    is_authenticated = bcrypt.check_password_hash(user.password, user_password)
    print(is_authenticated)

    if is_authenticated:
        additional_claims = {"email": user.email, "role": user.role.value}

        access_token = create_access_token(identity=str(
            user.id), additional_claims=additional_claims)

        return jsonify({"msg": "Usuario autenticado", "access_token": access_token}), 200

    return jsonify({"msg": "El usuario o contraseña es incorrecto"}), 401


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
