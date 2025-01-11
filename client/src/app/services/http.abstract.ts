import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class AbstractHttpService {
  protected constructor(protected http: HttpClient) {}

  /**
   * Perform a GET request.
   * @param url - Endpoint URL
   * @param params - Optional query parameters
   * @param headers - Optional HTTP headers
   */
  protected get<T>(
    url: string,
    params?: HttpParams | { [param: string]: string | string[] },
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.get<T>(url, { params, headers });
  }

  /**
   * Perform a POST request.
   * @param url - Endpoint URL
   * @param body - Request body
   * @param headers - Optional HTTP headers
   */
  protected post<T>(
    url: string,
    body: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  /**
   * Perform a PUT request.
   * @param url - Endpoint URL
   * @param body - Request body
   * @param headers - Optional HTTP headers
   */
  protected put<T>(
    url: string,
    body: any,
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }

  /**
   * Perform a DELETE request.
   * @param url - Endpoint URL
   * @param params - Optional query parameters
   * @param headers - Optional HTTP headers
   */
  protected delete<T>(
    url: string,
    params?: HttpParams | { [param: string]: string | string[] },
    headers?: HttpHeaders | { [header: string]: string | string[] }
  ): Observable<T> {
    return this.http.delete<T>(url, { params, headers });
  }
}
