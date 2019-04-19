import React, { Component } from 'react';
class Search extends Component {
    state = {  }
    render() { 
        return ( 
            <section id="subscribe">
                <div className="container">
                    <form method="POST" action="#">
                        <div className="form-row justify-content-center">
                            <div className="col-auto">
                                <input type="text" className="form-control" placeholder="Rechercher un employé" />
                            </div>
                            <div className="col-auto">
                                <button type="submit">Rechercher</button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>            
        );
    }
}
 
export default Search;