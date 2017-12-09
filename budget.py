from flask import Flask, flash, render_template, redirect, url_for, request, session, abort, jsonify
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)
app.config.update(dict(SEND_FILE_MAX_AGE_DEFAULT=0))

parser = reqparse.RequestParser()
parser.add_argument('name', type = str)
parser.add_argument('budget', type = int)
parser.add_argument('remaining', type = int)
parser.add_argument('category', type = str)
parser.add_argument('name', type = str)
parser.add_argument('spent', type = int)
parser.add_argument('date', type = str)




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
    return render_template("home.html")

class Category(Resource):
    def get(self):
        return CATEGORIES

    def post(self):
        print(CATEGORIES)
        category_id = len(CATEGORIES)+1
        args = parser.parse_args()
        category= {'id': category_id, 'name': args['name'], 'budget': args['budget'], 'remaining':args['remaining']}    
        CATEGORIES.append(category)
        return CATEGORIES[category_id-1], 201

    def delete(self, category_id):
        del CATEGORIES[category_id]
        return ' ', 204
   
   
class Purchase(Resource):
 
    def get(self):
        return PURCHASES

    def post(self):
        print(PURCHASES)
        
        args = parser.parse_args()
        purchase_id = len(PURCHASES)+1
        print(purchase_id)
        purchase = {'id': purchase_id,'category': args['category'], 'name':args['name'], 'spent':args['spent'], 'date': args['date']}
        
        for item in CATEGORIES:
            if item.get('name').lower() == purchase.get('category').lower():
                catBudget = item.get('budget')
                if item.get('remaining') is None:
                    item.update({'remaining': catBudget})
                remainingBudget = item.get('remaining') - purchase.get('spent')
                item.update({'remaining': remainingBudget})
        PURCHASES.append(purchase)
        return PURCHASES[purchase_id-1] , 201

api.add_resource(Category, '/cats', '/cats/<int:category_id>')

api.add_resource(Purchase, '/purchases/')

if __name__ == '__main__':
    app.run(port = 5000, host = 'localhost', debug = True)
