"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
    
@api.route('products/<int:product_id>', methods=['GET'])
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