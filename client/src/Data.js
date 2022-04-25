import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {    
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // Get Courses from REST API
  async getCourses() {
    const response = await this.api(`/courses`);
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error();
    }
  }

  // Get Course Detail By ID from REST API
  async getCourseDetail(id) {
    const response = await this.api(`/courses/${id}`);
    if (response.status === 200) {
      return response.json();
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  // DELETE Course by ID and with credential from REST API
  async deleteCourse(id, credential = null){
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, credential);
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  // UPDATE Course by ID, updated course information and with credential from REST API
  async updateCourse(id, course, credential=null) {
    const response = await this.api(`/courses/${id}`, 'PUT', course,true,credential);
    if (response.status === 204) {
       return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else if (response.status === 403) {
      // The author is not match with the credential
      throw new Error('FORBIDDEN');
    }
    else {
      throw new Error();
    }
  }
  // CREATE Course with course information and credential from REST API
  async createCourse(course, credential=null) {
    const response = await this.api('/courses', 'POST', course,true,credential);
    if (response.status === 201) {
      //console.log(response.headers.get('Location'))
      //This can get the ID of the course but not part of the requirement so is omited.
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
  // Gets the User by emailAddress and Password from REST API
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  // Create new User with firstName, lastName, emailAddress and Password
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }
}
