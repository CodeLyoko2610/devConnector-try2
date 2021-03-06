import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
const axios = require('axios');

const Register = () => {
  //Create state variable using useState hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  //Destructuring formData
  let { name, email, password, password2 } = formData;

  //Take in user input and update these input in UI
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Add async for making http request with axios
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Incorect passwords. Please change it.');
    } else {
      //Create a new user
      let newUser = {
        name,
        email,
        password
      };

      //Setting up the request
      try {
        let config = {
          headers: {
            'content-type': 'application/json'
          }
        };

        let body = JSON.stringify(newUser);

        //Making request using axios to create new user
        let res = await axios.post('/api/users', body, config); //with proxy specified in package.json, no need to write: http://localhost:8000/

        console.log(res.data);
      } catch (error) {
        console.log(error);
        console.log(error.response.data);
      }
    }
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            required
            onChange={e => onChange(e)}
            value={name} //setting the value of this field to the state's value
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            onChange={e => onChange(e)}
            value={email}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            onChange={e => onChange(e)}
            value={password}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            onChange={e => onChange(e)}
            value={password2}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
