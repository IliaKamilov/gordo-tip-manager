"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
exports.default = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    scalar JSON \n    scalar Date \n\n    type Subscription {\n        test: String\n        recordAdded: Record\n    }\n\n    type Query {\n        Authenticate: Authentication\n        getUsers: [User]\n        getShift(date: Date): Shift\n        getUserShifts: [Shift]\n    }\n\n    type Mutation {\n        Login(input: JSON): Authentication\n        AddAccount(input: JSON): JSON\n        DeleteAccount(id: String): JSON\n        UpdateAccount(input: JSON): JSON\n        AddRecord(input: JSON): Record\n        CloseShift(input: JSON): JSON\n        SignShift(input: JSON): JSON\n        SignRecord(input: JSON): JSON\n    }\n\n    type Authentication {\n        token: String\n        user: User\n    }\n\n    type User {\n        id: String\n        username: String\n        role: String\n        avatar: String\n        firstname: String\n        lastname: String\n    }\n\n    type Shift {\n        date: Date\n        records: [Record]\n        status: Status\n        isInShift: Boolean\n        tip: Int\n    }\n\n    type Status {\n        opened: Boolean\n        closed: ShiftStatus\n        signed: ShiftStatus\n    }\n\n    type ShiftStatus {\n        user: User\n        date: Date\n    }\n\n    type Record {\n        start: Date\n        end: Date\n        user: User\n        signed: Date\n    }\n"], ["\n    scalar JSON \n    scalar Date \n\n    type Subscription {\n        test: String\n        recordAdded: Record\n    }\n\n    type Query {\n        Authenticate: Authentication\n        getUsers: [User]\n        getShift(date: Date): Shift\n        getUserShifts: [Shift]\n    }\n\n    type Mutation {\n        Login(input: JSON): Authentication\n        AddAccount(input: JSON): JSON\n        DeleteAccount(id: String): JSON\n        UpdateAccount(input: JSON): JSON\n        AddRecord(input: JSON): Record\n        CloseShift(input: JSON): JSON\n        SignShift(input: JSON): JSON\n        SignRecord(input: JSON): JSON\n    }\n\n    type Authentication {\n        token: String\n        user: User\n    }\n\n    type User {\n        id: String\n        username: String\n        role: String\n        avatar: String\n        firstname: String\n        lastname: String\n    }\n\n    type Shift {\n        date: Date\n        records: [Record]\n        status: Status\n        isInShift: Boolean\n        tip: Int\n    }\n\n    type Status {\n        opened: Boolean\n        closed: ShiftStatus\n        signed: ShiftStatus\n    }\n\n    type ShiftStatus {\n        user: User\n        date: Date\n    }\n\n    type Record {\n        start: Date\n        end: Date\n        user: User\n        signed: Date\n    }\n"])));
var templateObject_1;