"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

vendors_bp = Blueprint('vendors', __name__, url_prefix='/api')

# Allow CORS requests to this API
CORS(vendors_bp)


@vendors_bp.route('/vendors/create_product', methods=['POST'])
def create_products():
    try:
        body = request.get_json(silent=True)

        if body is None:
            return jsonify({"msg": "El body no puede estar vacío"}), 400

        if "name" not in body:
            return jsonify({"msg": "Es necesario el nombre del Producto "}), 400

        if "price" not in body:
            return jsonify({"msg": "Es necesario el precio del producto"}), 400

        if "category_id" not in body:
            return jsonify({"msg": "Es necesario la categoria del producto"}),400

        if "vendor_id" not in body:
            return jsonify({"msg": "Es necesario el id del vendedor producto"}), 400

        product = Product.create_product(body)
        if product is None:
            return jsonify({"msg": "No se puedo crear el producto. Intente de nuevo"}), 409

        return jsonify({"msg": "Producto creado correctamente"}), 201
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500

@vendors_bp.route('/vendors/delete_product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = db.session.execute(db.select(Product).filter_by(id=product_id)).scalar_one_or_none()
        if not product: 
            return {'msg': 'Este Producto no se encontro'}, 404
        db.session.delete(product)
        db.session.commit()
        return {'msg': 'Producto ha sido eliminado exitosamente'}, 204
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500
    
@vendors_bp.route('/vendors/update_product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = db.session.execute(db.select(Product).filter_by(id=product_id)).scalar_one_or_none()
        if not product: 
            return {'msg': 'Este Producto no se encontro'}, 404
        body = request.get_json(silent=True)

        if body is None:
            return jsonify({"msg": "El body no puede estar vacío"}), 400
        if "name" in body:
            product.name = body["name"]
        if "description" in body:
            product.description = body["description"]
        if "price" in body:
            product.price = body["price"]
        if "image" in body:
            product.image = body["image"]
        if "category" in body:
            product.category = body["category"]
        if "stock" in body:
            product.stock = body["stock"]
        db.session.commit()
        return {'msg': 'Producto ha sido actualizado correctamente'}, 201
    except Exception as error:
        print(error)
        return jsonify({"msg": "Ocurrió un error", "error": error}), 500