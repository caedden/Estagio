import Menu from "../Body/Menu";
import './StyleNavBar.css'

export default function NavBar(){
    return(
        <div className="NavBarController">
            <div className="conainerNavBar">
                <div className="textNavBar">
                    <h2>BOTECO SERAFINA</h2>
                </div>
                <div>
                    <img src="./././menu.svg"  alt="" />
                </div>
            </div>
            <div>
                <Menu />
            </div>
        </div>
    )
}