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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var __1 = require("..");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var pubsub = new apollo_server_express_1.PubSub();
var RECORD_ADDED = 'RECORD_ADDED';
var resolvers = {
    Subscription: {
        test: {
            subscribe: function () { return pubsub.asyncIterator(['TEST_MESSAGE']); }
        },
        recordAdded: {
            subscribe: function () { return pubsub.asyncIterator([RECORD_ADDED]); }
        }
    },
    Query: {
        getUserShifts: function (root, args, _a) {
            var token = _a.token, user = _a.user;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    if (!user)
                        return [2 /*return*/, new Error('עלייך להיות מחובר')];
                    return [2 /*return*/, __1.db.getUserShifts(user)];
                });
            });
        },
        getShift: function (root, _a, _b) {
            var _c = _a.date, date = _c === void 0 ? new Date() : _c;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var shift;
                return __generator(this, function (_d) {
                    shift = __1.db.getShiftByDate(new Date(date));
                    return [2 /*return*/, __assign(__assign({}, shift), { isInShift: __1.db.isUserInShift(user, shift) })];
                });
            });
        },
        getUsers: function (root, args, _a) {
            var token = _a.token, user = _a.user;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    return [2 /*return*/, __1.db.getAllUsers()];
                });
            });
        },
        Authenticate: function (root, args, _a) {
            var token = _a.token, user = _a.user;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    return [2 /*return*/, {
                            user: user,
                            token: token
                        }];
                });
            });
        }
    },
    Mutation: {
        SignRecord: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var date, shift, record;
                return __generator(this, function (_c) {
                    date = input.date;
                    if (!date)
                        return [2 /*return*/, new Error('לא צויין תאריך משמרת')];
                    shift = __1.db.getShiftByDate(new Date(date));
                    if (!shift)
                        return [2 /*return*/, new Error('משמרת לא נמצאה')];
                    record = shift.records.find(function (r) { return r.user === user.id; });
                    if (!record)
                        return [2 /*return*/, new Error('אינך נמצא במשמרת')];
                    record.signed = new Date();
                    pubsub.publish(RECORD_ADDED, { recordAdded: record });
                    return [2 /*return*/, __1.db.signRecord(record)];
                });
            });
        },
        SignShift: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var date, shift;
                return __generator(this, function (_c) {
                    date = input.date;
                    if (!date)
                        return [2 /*return*/, new Error('לא צויין תאריך משמרת')];
                    if (!__1.db.hasAdminPermissions(user))
                        return [2 /*return*/, new Error('גישה נדחתה. אין לך הרשאות מנהל.')];
                    shift = __1.db.getShiftByDate(new Date(date));
                    if (!shift)
                        return [2 /*return*/, new Error('משמרת לא נמצאה')];
                    shift.status = __assign(__assign({}, shift.status), { signed: { user: user.id, date: new Date() } });
                    pubsub.publish(RECORD_ADDED, { recordAdded: shift });
                    return [2 /*return*/, __1.db.signShift(shift)];
                });
            });
        },
        CloseShift: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var date, tip, shift;
                return __generator(this, function (_c) {
                    date = input.date, tip = input.tip;
                    if (!date || !tip)
                        return [2 /*return*/, new Error('תאריך או טיפ חסר')];
                    shift = __1.db.getShiftByDate(new Date(date));
                    if (!shift)
                        return [2 /*return*/, new Error('משמרת לא נמצאה')];
                    if (!__1.db.isUserInShift(user, shift))
                        return [2 /*return*/, new Error('לא ניתן לסגור משמרת שאתה לא נמצא בה')];
                    shift.tip = tip;
                    shift.status = { closed: { user: user.id, date: new Date() }, opened: false };
                    pubsub.publish(RECORD_ADDED, { recordAdded: shift });
                    return [2 /*return*/, __1.db.closeShift(shift, user)];
                });
            });
        },
        AddRecord: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var date, kind, start, end, shift, isInShift, record;
                return __generator(this, function (_c) {
                    date = input.date, kind = input.kind, start = input.start, end = input.end;
                    shift = __1.db.getShiftByDate(new Date(date));
                    isInShift = __1.db.isUserInShift(user, shift);
                    if (isInShift)
                        return [2 /*return*/, new Error('הנך כבר נמצא במשמרת')];
                    record = __1.db.addRecord(shift, { start: start, end: end, user: user.id });
                    pubsub.publish(RECORD_ADDED, { recordAdded: record });
                    return [2 /*return*/, record];
                });
            });
        },
        UpdateAccount: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var target, id, firstname, lastname, role, account;
                return __generator(this, function (_c) {
                    target = input.target, id = input.id, firstname = input.firstname, lastname = input.lastname, role = input.role;
                    if (!target)
                        return [2 /*return*/, new Error('מספר תז חסר')];
                    if (!__1.db.hasAdminPermissions(user))
                        return [2 /*return*/, new Error('גישה נדחתה. אין לך הרשאות לביצוע פעולה זו')];
                    account = __1.db.getUserById(target);
                    if (!account)
                        return [2 /*return*/, new Error('משתמש לא נמצא')];
                    return [2 /*return*/, __1.db.updateUserById(target, input)];
                });
            });
        },
        DeleteAccount: function (root, _a, _b) {
            var id = _a.id;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_c) {
                    if (!id)
                        return [2 /*return*/, new Error('לא נבחר משתמש')];
                    if (!__1.db.hasAdminPermissions(user))
                        return [2 /*return*/, new Error('גישה נדחתה. אין לך הרשאות לביצוע פעולה זו')];
                    return [2 /*return*/, __1.db.deleteUserById(id)];
                });
            });
        },
        AddAccount: function (root, _a, _b) {
            var input = _a.input;
            var token = _b.token, user = _b.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var id, firstname, lastname;
                return __generator(this, function (_c) {
                    id = input.id, firstname = input.firstname, lastname = input.lastname;
                    if (!id || !firstname || !lastname)
                        return [2 /*return*/, new Error('כל השדות חובה')];
                    if (!__1.db.hasAdminPermissions(user))
                        return [2 /*return*/, new Error('גישה נדחתה. אין לך הרשאות לביצוע פעולה זו')];
                    if (__1.db.getUserById(id))
                        return [2 /*return*/, new Error('מספר תז קיים במערכת')];
                    __1.db.addAccount({ id: id, firstname: firstname, lastname: lastname });
                    return [2 /*return*/, {
                            success: true
                        }];
                });
            });
        },
        Login: function (root, _a) {
            var input = _a.input;
            return __awaiter(void 0, void 0, void 0, function () {
                var id, password, user, match, token;
                return __generator(this, function (_b) {
                    id = input.id, password = input.password;
                    if (!id || !password)
                        return [2 /*return*/, new Error('כל השדות הם חובה.')];
                    user = __1.db.getUserById(id);
                    if (!user)
                        return [2 /*return*/, new Error('מספר תז לא קיים במערכת')];
                    match = bcryptjs_1.default.compareSync(password, user.password);
                    if (!match)
                        return [2 /*return*/, new Error('סיסמה לא נכונה')];
                    token = jsonwebtoken_1.default.sign({ id: user.id }, __1.SECRET_KEY);
                    return [2 /*return*/, {
                            token: token,
                            user: user
                        }];
                });
            });
        }
    },
    Record: {
        user: function (root) { return __1.db.getUserById(root.user); }
    },
    ShiftStatus: {
        user: function (root) { return __1.db.getUserById(root.user); }
    }
};
exports.default = resolvers;
