import './StyleLoginScreen.css';

export default function LoginScreen(){
    return(
        <div className="containerLogin">
            <div className="loginBox">
                <div className="loginForm">
                <h1 style={{marginBottom: "0px", marginTop: "15px"}}> <img src="././logo.png" alt="" /> </h1>
                    <form>
                        <div>
                            <label for="usuario"></label>
                            <input className="loginText" type="text" id="usuario" placeholder="Usuário"/>
                        </div>
                        <div >
                            <label for="password"></label>
                            <input className="loginText" type="password" id="password" placeholder="Senha"/>
                        </div>
                        <div>
                            <p style={{marginBottom: "15px"}}>Não tem uma conta ainda ? <a href="">Registre-se</a> </p>
                        </div>
                        <div class="loginButton">
                            <label for="btn"></label>
                            <button type="submit" id="btn" style={{borderRadius: "5px", width: "100px",height: "30px", backgroundColor: "#80ed99"}}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}