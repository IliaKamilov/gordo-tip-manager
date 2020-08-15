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
var fs_1 = __importDefault(require("fs"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var shortid_1 = __importDefault(require("shortid"));
var adminRoles = ['מנהל', 'מפתח'];
var Database = /** @class */ (function () {
    function Database(path) {
        var _this = this;
        this.dbPath = '';
        this.data = {};
        this.hasAdminPermissions = function (user) {
            return Boolean(adminRoles.includes(user.role));
        };
        this.isUserInShift = function (user, shift) {
            return Boolean(shift.records.find(function (r) { return r.user === user.id; }));
        };
        this.getUserShifts = function (user) {
            return _this.data.shifts.filter(function (r) {
                return _this.isUserInShift(user, r);
            });
        };
        this.signRecord = function (record) {
            _this.save();
            return record;
        };
        this.signShift = function (shift) {
            var s = _this.data.shifts.find(function (r) { return r.date === shift.date; });
            if (!s)
                return new Error('משמרת לא נמצאה');
            _this.save();
            return s;
        };
        this.closeShift = function (shift, user) {
            var s = _this.data.shifts.find(function (r) { return r.date === shift.date; });
            if (!s)
                return new Error('משמרת לא נמצאה');
            _this.save();
            return s;
        };
        this.getShiftByDate = function (date) {
            if (date === void 0) { date = new Date(); }
            var _a;
            var time = date.getHours() + (date.getMinutes() / 60);
            var stime = time >= 16 ? 16 : 9;
            var shift = _this.data.shifts.find(function (s) {
                var d = new Date(s.date);
                return d.getFullYear() === date.getFullYear() &&
                    d.getDate() === date.getDate() &&
                    d.getMonth() === date.getMonth() &&
                    (d.getHours() + (d.getMinutes() / 60)) === stime;
            }) || {
                date: date,
                records: [],
                status: { opened: true },
                isInShift: false
            };
            var sd = new Date(shift.date);
            shift.status = __assign(__assign({}, shift.status), { opened: !Boolean((_a = shift.status) === null || _a === void 0 ? void 0 : _a.closed) });
            return shift;
        };
        this.addRecord = function (shift, record) {
            var s = _this.data.shifts.find(function (s) { return s.date === shift.date; });
            delete shift.isInShift;
            shift.records.push(record);
            if (!s)
                _this.data.shifts.push(shift);
            _this.save();
            return record;
        };
        this.addAccount = function (data) {
            var id = data.id, firstname = data.firstname, lastname = data.lastname;
            var user = {
                id: id,
                firstname: firstname,
                lastname: lastname,
                avatar: '',
                password: bcryptjs_1.default.hashSync('123456', bcryptjs_1.default.genSaltSync(10)),
                role: 'מלצר',
                username: shortid_1.default.generate()
            };
            _this.data.users.push(user);
            _this.save();
        };
        this.getUserById = function (id) {
            var user = _this.data.users.find(function (user) { return user.id === id; });
            return user;
        };
        this.getAllUsers = function () {
            return _this.data.users;
        };
        this.updateUserById = function (id, update) {
            var account = _this.getUserById(id);
            if (!account)
                return new Error('משתמש לא נמצא');
            var updateKeys = ['id', 'firstname', 'lastname', 'role'];
            Object.keys(update).forEach(function (key) {
                if (!updateKeys.includes(key))
                    return;
                account[key] = update[key];
            });
            _this.save();
            return { status: 200, response: 'משתמש עודכן בהצלחה' };
        };
        this.deleteUserById = function (id) {
            _this.data.users = _this.data.users.filter(function (user) { return user.id !== id; });
            _this.save();
            return { deleted: true };
        };
        this.dbPath = path;
        var file = fs_1.default.readFileSync(path, { encoding: 'utf-8' });
        this.data = JSON.parse(file);
    }
    Database.prototype.save = function () {
        fs_1.default.writeFile(this.dbPath, JSON.stringify(this.data), function (err) {
            if (err)
                return console.log("db update failed", err.message);
            return console.log("db update successfully");
        });
    };
    return Database;
}());
exports.default = Database;
