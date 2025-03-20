"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SISAdapter = void 0;
const tsyringe_1 = require("tsyringe");
const external_1 = require("@config/external");
let SISAdapter = class SISAdapter {
    apiUrl;
    apiKey;
    constructor() {
        this.apiUrl = external_1.config.sis.apiUrl;
        this.apiKey = external_1.config.sis.apiKey;
    }
    async getStudentInfo(_studentId) {
        throw new Error('Método não implementado');
    }
    async getStudentEnrollments(_studentId) {
        throw new Error('Método não implementado');
    }
    async updateStudentInfo(_studentId, _data) {
        throw new Error('Método não implementado');
    }
    async syncAcademicData(_studentId) {
        throw new Error('Método não implementado');
    }
    async getStudentAttendance(_studentId) {
        throw new Error('Método não implementado');
    }
    async updateStudentRecord(_studentId, _data) {
        throw new Error('Método não implementado');
    }
    async syncStudentData(_studentId) {
        throw new Error('Método não implementado');
    }
};
exports.SISAdapter = SISAdapter;
exports.SISAdapter = SISAdapter = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], SISAdapter);
//# sourceMappingURL=SISAdapter.js.map