import './App.css';
import React from "react";

class App extends React.Component<any,any> {
  constructor(props:any){
    super(props);
    this.state = {
      star: 9
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className='left'>
            {/* {Range(1,)} */}

          </div>
          &#9733;

        </div>
    </div>
    );
  }
}

export default App;