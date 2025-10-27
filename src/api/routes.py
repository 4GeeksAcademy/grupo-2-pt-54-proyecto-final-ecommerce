"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/products', methods=['GET'])
def get_all_products():
    try:
        products_list = []
        # Para mostrar todos los usuarios. (Tipo: select all)
        products = db.session.execute(db.select(Product)).scalars().all()
        for product in products:
            products_list.append(product.serialize())

        return jsonify({"products": products_list}), 200
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500

@api.route('/categories/<name>', methods=['POST'])
def add_new_category(name):
    try:
        category = Category.create_category({"name": name})

        if category:
            return jsonify({'msg': "Categoria creada correctamente"}), 201

        return jsonify({"msg": "No fue posible crear la categoria"}), 500
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500

@api.route('/categories', methods=['GET'])
def get_all_categories():
    try:
        category_list = []
        # Para mostrar todos las categorias. (Tipo: select all)
        categories = db.session.execute(db.select(Category)).scalars().all()
        for category in categories:
            category_list.append(category.serialize())

        return jsonify({"categories": category_list}), 200
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500
    
@api.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = db.session.execute(db.select(Product).filter_by(id=product_id)).scalar_one_or_none()

        if product is None:
            return jsonify({"msg": "Producto no encontrado"}), 404

        return jsonify({"products": product.serialize()}), 200
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500
    
@api.route('/category/<int:category_id>/products', methods=['GET'])
def get_products_by_category(category_id):
    try:
        products = db.session.execute(db.select(Product).filter_by(category_id=category_id)).scalars().all()

        if products is None:
            return jsonify({"msg": "Productos no encontrado"}), 404
        
        products_list = [product.serialize() for product in products]   

        return jsonify({"products": products_list}), 200
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500
    
@api.route('/search/products/<product_name>', methods=['GET'])
def get_products_by_nam(product_name):
    try:
        products = db.session.execute(db.select(Product).filter(Product.name.ilike(f"%{product_name}%"))).scalars().all()

        if not products:
            return jsonify({"msg": "Producto no encontrado"}), 404
        
        products_list = [product.serialize() for product in products]
        return jsonify({"products": products_list}), 200
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": str(error)}), 500

@api.route('/user-info', methods=['GET'])
@jwt_required()
def handle_get_user_info():
    user_id = get_jwt_identity()
    claims = get_jwt()
    claim_email = claims.get("email")
    
    user = db.session.execute(db.select(User).filter_by(email=claim_email)).scalar_one_or_none()

    return jsonify({'id': user_id, "info": user.serialize()}), 200