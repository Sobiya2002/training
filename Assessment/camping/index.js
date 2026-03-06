const shopping = (products, list) => {
    const itemToDept = new Map();
    for (let [item, department] of products) {
        itemToDept.set(item, department);
    }

    /**
     *    Map(13) {
  'Cheese' => 'Dairy',
  'Carrots' => 'Produce',
  'Potatoes' => 'Produce',
  'Canned Tuna' => 'Pantry',
  'Romaine Lettuce' => 'Produce',
  'Chocolate Milk' => 'Dairy',
  'Flour' => 'Pantry',
  'Iceberg Lettuce' => 'Produce',
  'Coffee' => 'Pantry',
  'Pasta' => 'Pantry',
  'Milk' => 'Dairy',
  'Blueberries' => 'Produce',
  'Pasta Sauce' => 'Pantry'
}
 */
    const departmentSeq = [];
    for (let item of list) {
        departmentSeq.push(itemToDept.get(item));
    }

    let prevDept = null;
    let orderedVisits = 0;
    for (let d of departmentSeq) {
        if (d != prevDept) {
            orderedVisits++;
            prevDept = d;
        }
    }

    /** Set will remove the duplicate item from the departmentSeq 
    */
    const departmentSeq_set = new Set(departmentSeq);
    const minimalVisits = orderedVisits - departmentSeq_set.size;
    return minimalVisits;
}

const products = [
    ["Cheese", "Dairy"],
    ["Carrots", "Produce"],
    ["Potatoes", "Produce"],
    ["Canned Tuna", "Pantry"],
    ["Romaine Lettuce", "Produce"],
    ["Chocolate Milk", "Dairy"],
    ["Flour", "Pantry"],
    ["Iceberg Lettuce", "Produce"],
    ["Coffee", "Pantry"],
    ["Pasta", "Pantry"],
    ["Milk", "Dairy"],
    ["Blueberries", "Produce"],
    ["Pasta Sauce", "Pantry"]
];

const list1 = ["Blueberries", "Milk", "Coffee", "Flour", "Cheese", "Carrots"];

const list2 = ["Blueberries", "Carrots", "Coffee", "Milk", "Flour", "Cheese"];

const list3 = ["Blueberries", "Carrots", "Romaine Lettuce", "Iceberg Lettuce"];

const list4 = ["Milk", "Flour", "Chocolate Milk", "Pasta Sauce"];

const list5 = ["Cheese", "Potatoes", "Blueberries", "Canned Tuna"];


console.log(shopping(products, list1));
console.log(shopping(products, list2));
console.log(shopping(products, list3));
console.log(shopping(products, list4));
console.log(shopping(products, list5));