from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def main():
    return render_template('base.html')

@main_bp.route('/<section>')
def section(section):
    try:
        return render_template(f'{section}.html')
    except:
        return render_template("404.html")