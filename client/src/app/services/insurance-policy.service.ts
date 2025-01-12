import { Injectable } from '@angular/core';
import {AbstractHttpService} from './http.abstract';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {InsurancePolicy} from '../../types';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsurancePolicyService extends AbstractHttpService{
  private readonly baseInsurancePoliciesUrl= environment.APIUrl + 'insurance-policies'

  constructor(httpClient: HttpClient) {super(httpClient);}

  getAll() {
    return this.get<InsurancePolicy[]>(this.baseInsurancePoliciesUrl)
  }

  getOne(insurancePolicyId: string) {
    return this.get<InsurancePolicy>(this.baseInsurancePoliciesUrl + '/' + insurancePolicyId);
  }

  new(insurancePolicy: InsurancePolicy) {
    return this.post<InsurancePolicy>(this.baseInsurancePoliciesUrl, insurancePolicy);
  }

  update(insurancePolicy: InsurancePolicy) {
    return this.put<InsurancePolicy>(this.baseInsurancePoliciesUrl + '/' + insurancePolicy.id, insurancePolicy);
  }

  save(insurancePolicy: InsurancePolicy) {
    if (!insurancePolicy.id) {
      return this.new(insurancePolicy)
    } else {
      return this.update(insurancePolicy)
    }
  }

  remove(insurancePolicyId: string) {
    return this.delete(this.baseInsurancePoliciesUrl + '/' + insurancePolicyId);
  }

}
