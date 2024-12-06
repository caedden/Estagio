import './StyleMenu.css'

export default function Menu(){
    return(
        <div className="menu">
            <div className="menuItems">
                <img src="./././drink.png" alt="" className="imgMenu"/>
                <p>DRINKS</p>
            </div>
            <div className="menuItems">
                <img src="./././cerveja.png" alt="" className="imgMenu"/>
                <p>CERVEJAS</p>
            </div>
            <div className="menuItems">
                <img src="./././vinho.png" alt="" className="imgMenu"/>
                <p>VINHOS</p>
            </div>
            <div className="menuItems">
                <img src="./././nao-alcoolico.png" alt="" className="imgMenu"/>
                <p>NÃO ALCOOLICOS</p>
            </div>
            <div className="menuItems">
                <img src="./././batata-frita.png" alt="" className="imgMenu"/>
                <p>PORÇÕES</p>
            </div>
            <div className="menuItems">
                <img src="./././whisky.png" alt="" className="imgMenu"/>
                <p>DOSES DE WHISKY</p>
            </div>
            <div className="menuItems">
                <img src="./././garrafa.png" alt="" className="imgMenu"/>
                <p>GARRAFAS</p>
            </div>
            <div className="menuItems">
                <img src="./././balde-de-gelo.png" alt="" className="imgMenu"/>
                <p>COMBOS</p>
            </div>
        </div> 
    )
}