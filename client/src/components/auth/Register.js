import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

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

  //Take in user input
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' action='create-profile.html'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            required
            onChange={e => onChange(e)}
            value={name}
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
