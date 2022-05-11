const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = "todo.proto";
// const options = {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// };
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = protoDescriptor.todopackage;


/**
 * Implements the createTodo RPC method.
 */
const todos = []
function createTodo(call, callback) {
  const todoItem = {
    "id": todos.length + 1,
    "text": call.request.text
}
  todos.push(todoItem)
  callback(null, todoItem);
}
/**
 * Implements the readTodo RPC method.
 */
function readTodos(call, callback) {
  console.log(todos)
  callback(null, {"items": todos})
}

/**
 * Implements the readTodosStream RPC method.
 */
function readTodosStream(call, callback) {
  todos.forEach(t => call.write(t));
  call.end();
} 


/**
 * Starts an RPC server that receives requests for the Todo service at the
 * sample server port
 */
function main() {
  const server = new grpc.Server();

  //Adding the protobuff services
  server.addService(todoPackage.Todo.service, {
    //Mapping services
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
  });

  //Start listening
  server.bindAsync(
    "127.0.0.1:40000",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:40000");
      server.start();
    }
  );
}

main();
