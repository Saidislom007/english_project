import "./home.css";
import { Component } from "react";
import { Link } from "react-router-dom"; // ✅ Link komponenti qo‘shildi


class Homepage extends Component {
  render() {
    return (
      <div className="homepage-container">
        <h1>You are welcome</h1>
        <div className="button-group">
          <Link to="/reading">
            <button className="btn">Reading</button> {/* ✅ Reading sahifasiga yo‘naltiradi */}
          </Link>
          <Link to="/listening">  
            <button className="btn">Listening</button> {/* ✅ BeginnerList sahifasiga yo‘naltiradi */}
          </Link>
          <Link to="/writing">  
            <button className="btn">Writing</button> {/* ✅ BeginnerList sahifasiga yo‘naltiradi */}
          </Link>
          <Link to="/speaking">  
            <button className="btn">Speaking</button> {/* ✅ BeginnerList sahifasiga yo‘naltiradi */}
          </Link>
          
        </div>
        <div className="container">
      {/* Video orqa fon */}
        <video className="video-background" autoPlay loop muted>
        <source src="/bg.mp4" type="video/mp4" />
        </video>
      </div>
      </div>

      
    );
  }
}

export default Homepage;



{/* <div className="video-container">
  <video autoPlay loop muted>
    <source src={videoBg} type="video/mp4" />
  </video>
  <div className="content">
    <h1>Welcome to My Website</h1>
    <p>This is a background video example.</p>
  </div>
</div> */}