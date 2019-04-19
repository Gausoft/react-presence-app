import React, { Component } from 'react';
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3333/api/v1'

class Employees extends Component {
    constructor(props){
        super(props)
        this.state = {
            employees: null
        }
    }

    componentDidMount = () => {
      axios.get('/employees').then(res=>{
        //   console.log(res.data)
          this.setState({ employees: res.data })
      }).catch(error=>{
          console.log(error)
      })
    };
    
    render() { 
        return ( 
            <div>
                <h1>Listes des employes</h1>
                <ul>
                    {
                        this.state.employees ? this.state.employees.map(e => (
                                <li key={e.id}>{e.firstname}</li>
                            )
                        ) : <h4>Loading...</h4>
                        // this.state.employees.map(e => (<h4>{e.firstname}</h4>))
                    }    
                </ul>            
            </div>
        );
    }
}
 
export default Employees;