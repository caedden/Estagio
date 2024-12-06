import './StyleCustomerRegister.css';

export default function CustomerRegister(){
    return(
        <div>
            <form>
                <div className='registerContainer'>
                    <div className="boxRegister">
                    <div>
                        <h1 style={{}}>Cadastro de Clientes</h1>
                    </div>
                        <div>
                            <p>ID:</p>
                            <label htmlFor="idClient"></label>
                            <input className="customerData" type="text" id="idClient"/>
                        </div>
                        <div>
                            <p>Nome:</p>
                            <label htmlFor="name"></label>
                            <input className="customerData" type="text" id="name"/>
                        </div>
                        <div>
                            <p>Telefone:</p>
                            <label htmlFor="phone"></label>
                            <input className="customerData" type="tel" id="phone"/>
                        </div>
                        <div>
                            <p>Email:</p>
                            <label htmlFor="email"></label>
                            <input className="customerData" type="email" id="email"/>
                        </div>
                        <div>
                            <p>Documento:</p>
                            <label htmlFor="document"></label>
                            <input className="customerData" type="number" id="document"/>
                        </div>
                        <div>
                            <p>Endereço:</p>
                            <label htmlFor="street"></label>
                            <input className="customerData" style={{marginBottom: "20px"}} type="text" id="street"/>
                        </div>
                            <button type="submit" style={{borderRadius: "5px", width: "100px",height: "30px", backgroundColor: "#80ed99", cursor: "pointer"}}>Cadastrar</button>
                    </div>
                </div>
            </form>
        </div>
    )
}