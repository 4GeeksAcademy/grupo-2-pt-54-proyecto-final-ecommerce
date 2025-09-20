from datetime import date, datetime, UTC
import enum
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Float, Integer, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class UserRole(enum.Enum):
    USER = "user"
    SELLER = "seller"
    ADMIN = "admin"


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120))
    last_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password: Mapped[str] = mapped_column(String(16))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.USER)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    creation_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))

    #relationship
    orders: Mapped[list["Order"]] = relationship(back_populates="user")
    products: Mapped[list["Product"]] = relationship(back_populates="vendor")

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role,
            "is_active": self.is_active,
            # do not serialize the password, its a security breach
        }
    
class Product(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(300))
    price: Mapped[float] = mapped_column(Float, nullable=False)
    image: Mapped[str] = mapped_column(String())
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=False)
    vendor_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    creation_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))

    #relationship
    category: Mapped["Category"] = relationship(back_populates="products")
    vendor: Mapped["User"] = relationship(back_populates="products")
    
    #Metodo para crear producto
    @classmethod
    def create_product(cls, data):
        try:
            new_product = cls(**data)
            db.session.add(new_product)
            db.session.commit()
            return True
        except Exception as error:
            print(error)
            return None

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image": self.image,
            "category_id": self.category_id,
            "stock": self.stock,
        }

class Order(db.Model):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    creation_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(UTC))
    num_order: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    total_price: Mapped[float] = mapped_column(Float(precision=10, decimal_return_scale=2), default=0.0)
    shipping_address: Mapped[str] = mapped_column(Text)

    #Relationship
    user: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "num_order": self.num_order,
            "total_price": self.total_price,
            "shipping_address": self.shipping_address,
        }

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Float] = mapped_column(Float(precision=10, decimal_return_scale=2), nullable=False)
    subtotal: Mapped[Float] = mapped_column(Float(precision=10, decimal_return_scale=2), nullable=False)

    #Relation_ship
    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "subtotal": self.subtotal,
        }

class Category(db.Model):
    # __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    #Relationship
    products: Mapped[list["Product"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }