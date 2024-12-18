import './StyleRegistrationScreen.css';

export default function RegistrationScreen(){
    return(
        <div className="containerRegister">
            <div className="registerBox">
                <div className="registerForm">
                <h1 style={{marginBottom: "-20px", marginTop: "70px"}}>CADASTRE-SE !</h1>
                    <form>
                        <div>
                            <label for="usuario"></label>
                            <input className="registerText" type="text" id="usuario" placeholder="Usuário"/>
                        </div>
                        <div >
                            <label for="password"></label>
                            <input className="registerText" type="password" id="password" placeholder="Senha"/>
                        </div>
                        <div class="registerButton">
                            <label for="btn"></label>
                            <button type="submit" id="btn" style={{borderRadius: "5px", width: "100px",height: "30px", backgroundColor: "#80ed99", marginTop: "25px"}}>Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}