import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const SignedOutLinks = () => {

   return (
      <ul className="right">
         <li><NavLink to='/signup'>Sign Up</NavLink></li>
         <li><NavLink to='/signin'>Sign In</NavLink></li>
         <li ><Link to='/map' className='btn'>Map</Link></li>
      </ul>
   )

}
export default SignedOutLinks;