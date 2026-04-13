"""Initial schema — all tables

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True, index=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20)),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('is_admin', sa.Boolean(), server_default='false'),
        sa.Column('email_verified', sa.Boolean(), server_default='false'),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime()),
        sa.Column('last_login', sa.DateTime()),
    )

    op.create_table('categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('slug', sa.String(100), nullable=False, unique=True),
        sa.Column('description', sa.Text()),
        sa.Column('image_url', sa.String(500)),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
    )

    op.create_table('products',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), nullable=False, unique=True),
        sa.Column('description', sa.Text()),
        sa.Column('brand', sa.String(100)),
        sa.Column('category_id', sa.String(36), sa.ForeignKey('categories.id')),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('discount_price', sa.Numeric(10, 2)),
        sa.Column('stock_quantity', sa.Integer(), server_default='0'),
        sa.Column('sku', sa.String(100)),
        sa.Column('images', sa.JSON()),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('is_featured', sa.Boolean(), server_default='false'),
        sa.Column('rating_average', sa.Numeric(3, 2), server_default='0'),
        sa.Column('rating_count', sa.Integer(), server_default='0'),
        sa.Column('extra_data', sa.JSON()),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime()),
    )

    op.create_table('orders',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('order_number', sa.String(50), nullable=False, unique=True),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('tax', sa.Numeric(10, 2), server_default='0'),
        sa.Column('shipping', sa.Numeric(10, 2), server_default='0'),
        sa.Column('discount', sa.Numeric(10, 2), server_default='0'),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', sa.String(50), server_default='pending'),
        sa.Column('payment_method', sa.String(50)),
        sa.Column('shipping_address', sa.JSON(), nullable=False),
        sa.Column('billing_address', sa.JSON()),
        sa.Column('tracking_number', sa.String(100)),
        sa.Column('customer_notes', sa.Text()),
        sa.Column('admin_notes', sa.Text()),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime()),
        sa.Column('paid_at', sa.DateTime()),
        sa.Column('shipped_at', sa.DateTime()),
        sa.Column('delivered_at', sa.DateTime()),
    )

    op.create_table('order_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('order_id', sa.String(36), sa.ForeignKey('orders.id'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('product_name', sa.String(200), nullable=False),
        sa.Column('product_brand', sa.String(100)),
        sa.Column('product_image', sa.String(500)),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('total_price', sa.Numeric(10, 2), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('users')
