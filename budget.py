from flask import Flask, flash, render_template, redirect, url_for, request, session, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)
app.config.update(dict(SEND_FILE_MAX_AGE_DEFAULT=0))

parser = reqparse.RequestParser()
parser.add_argument('name', type = str)
parser.add_argument('budget', type = int)
parser.add_argument('remaining', type = int)
TOTAL_BUDGET = 2000

CATEGORIES= [
    {   
        'id' : 1,
        'name': 'Food',
        'budget': 200,
        'remaining': 200,
      
    }, 
    {
        'id': 2,
        'name':'Entertainment',
        'budget':200,
        'remaining': 200,
    },
    {
        'id': 3,
        'name':'Rent',
        'budget': 1000,
        'remaining':1000,
    },
    {   
        'id' : 4,
        'name':'Gas',
        'budget': 100,
        'remaining':100,
    },
    {   
        'id' : 5,
        'name':'Uncategorized',
        'budget':100
        
    }
]

PURCHASES=[
    {
        'id' : 1,
        'category':'Food',
        'name': 'Chipotle',
        'spent': 10,
        'date': '11/30/17'
    },
    {
        'id' : 2,
        'category':'Entertainment',
        'name':'Netflix',
        'spent':9,
        'date':'12/06/17'
    },
    {   
        'id' : 3,
        'category':'Gas',
        'name':'gas',
        'spent':20,
        'date':'12/07/17'
    },
    {
        'id' : 4,
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
        args = parser.parse_args()
        category_id = 1
        for item in CATEGORIES:
            if item.get('id') > category_id:
                category_id = item.get('id')
        category= {'name': args['name'], 'budget': args['budget'], 'remaining':args['remaining']}    
        CATEGORIES.append(category)
        return CATEGORIES[category_id], 201

    def delete(self, category_id):
        del CATEGORIES[category_id]
        return ' ', 204
   
   
class Purchase(Resource):
    def get(self):
        return PURCHASES

    # def post(self):
    #     args = parser.parse_args()
    #     purchase_id = 
    # def delete(self, purchase_id):

api.add_resource(Category, '/cats', '/cats/<int:category_id>')


api.add_resource(Purchase, '/purchases/')

if __name__ == '__main__':
    app.run(port = 5000, host = 'localhost', debug = True)
