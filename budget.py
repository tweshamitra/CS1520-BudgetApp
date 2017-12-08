from flask import Flask, flash, render_template, redirect, url_for, request, session, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('name')

TOTAL_BUDGET = 2000

CATEGORIES= [
    {
        'name': 'Food',
        'remaining': 200,
      
    }, 
    {
        'name':'Entertainment',
        'remaining': 200,
    },
    {
        'name':'Rent',
        'remaining':1000,
    },
    {
        'name':'Gas',
        'remaining':100,
    },
    {
        'name':'Uncategorized',
        
    }
]

PURCHASES=[
    {
        'category':'Food',
        'name': 'Chipotle',
        'spent': 10,
        'date': '11/30/17'
    },
    {
        'category':'Entertainment',
        'name':'Netflix',
        'spent':9,
        'date':'12/06/17'
    },
    {
        'category':'Gas',
        'name':'gas',
        'spent':20,
        'date':'12/07/17'
    },
    {
        'category':'Rent', 
        'name':'November rent',
        'spent':1000,
        'date':'12/01/17'
    }
]

@app.route("/")
def home_page():
    return render_template("home.html", categories = CATEGORIES)

class Category(Resource):
    def get(self):
        return CATEGORIES

    def post(self):
        print("here")
        args = parser.parser_args()
        print(args)
        # category = {'name': args['name']}
        CATEGORIES.append(category)
        return CATEGORIES, 201

    def delete(self):
        args = parser.parse_args()
        categoryName = {'name' : args['name']}
        print(categoryName)
        for cat in categories:
           if cat.name == categoryName:
               del cat
        return ' ', 204

    # def delete(self, category_id):
    #     abort_if_category_doesnt_exist(category_id)
    #     del CATEGORIES[category_id]
    #     return '', 204

class Purchase(Resource):
    def get(self):
        return PURCHASES

    # def post(self):
    #     args = parser.parse_args()
    #     purchase_id = 
    # def delete(self, purchase_id):

api.add_resource(Category, '/cats', '/cats/<name>')


api.add_resource(Purchase, '/purchases/')

if __name__ == '__main__':
    app.run(port = 5000, host = 'localhost', debug = True)
