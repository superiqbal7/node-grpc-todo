const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = "todo.proto"; 
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = protoDescriptor.todopackage;

const text = process.argv[2];

const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

client.createTodo({
  "id": -1,
  "text": text
}, (err, response) => {

  console.log("Recieved from server 1" + JSON.stringify(response))

})

client.readTodos(null, (err, response) => {
  console.log("Recieved from server 2" + JSON.stringify(response))
  if (!response.items)
        response.items.forEach(a=>console.log(a.text));
})

const call = client.readTodosStream();
call.on("data", item => {
    console.log("received item from server " + JSON.stringify(item))
})

call.on("end", e => console.log("server done!"))
