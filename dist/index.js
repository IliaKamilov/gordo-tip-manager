"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var apollo_server_express_1 = require("apollo-server-express");
var cors_1 = __importDefault(require("cors"));
var resolvers_1 = __importDefault(require("./apollo/resolvers"));
var typeDefs_1 = __importDefault(require("./apollo/typeDefs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var db_1 = __importDefault(require("./db"));
var db_path = path_1.default.join(__dirname, "../db/" + (process.env.NODE_ENV === 'production' ? 'prod' : 'local') + ".json");
exports.db = new db_1.default(db_path);
exports.SECRET_KEY = process.env.SECRET_KEY || 'NotSecuredKey';
var verifyToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
    }
    catch (error) {
        return undefined;
    }
};
var app = express_1.default();
var http = http_1.default.createServer(app);
var apollo = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers: resolvers_1.default,
    context: function (_a) {
        var req = _a.req, connection = _a.connection;
        var _b;
        if (connection) {
            var token = connection.context.token;
            var decoded = verifyToken(token);
            var id = decoded ? decoded.id : undefined;
            if (!id)
                return;
            var user = exports.db.getUserById(id);
            return __assign(__assign({}, connection.context), { user: user });
        }
        else {
            var token = ((_b = req.headers.token) === null || _b === void 0 ? void 0 : _b.toString()) || '';
            var decoded = verifyToken(token);
            var id = decoded ? decoded.id : undefined;
            if (!id)
                return;
            var user = exports.db.getUserById(id);
            return {
                token: token,
                user: user
            };
        }
    }
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../images')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../build')));
app.use(cors_1.default());
app.get('/:username/avatar', function (req, res) {
    var username = req.params.username;
    var avatar_path = "./images/" + username + "-avatar.jpg";
    var file = fs_1.default.createReadStream(avatar_path);
    file.on('open', function () {
        res.set('Content-Type', 'image/jpeg');
        file.pipe(res);
    });
    file.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});
var root = path_1.default.join(__dirname, "../build");
app.get('*', function (req, res) {
    res.sendFile('./index.html', { root: root });
});
apollo.applyMiddleware({ app: app });
apollo.installSubscriptionHandlers(http);
var port = process.env.PORT || 4000;
http.listen(port, function () {
    console.log("listening *:" + port);
    console.log("[apollo] Server runing on http://localhost:" + port + apollo.graphqlPath);
    console.log("[apollo] Subscriptions server runing on ws://localhost:" + port + apollo.subscriptionsPath);
});
