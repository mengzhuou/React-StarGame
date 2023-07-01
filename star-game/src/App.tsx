import './App.css';
import React from "react";

class App extends React.Component<any,any> {
  constructor(props:any){
    super(props);
    this.state = {
      starNum: this.getRandomNum(1, 9),
      clickNum: 9
    }
  }

  starRange(min: number, max: number): number[] {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  getRandomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max-min+1))+min;
  }

  render() {
    const { starNum, clickNum } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <div className='gameBody'>
            <div className='left'>
              <div className='grid'>
                {this.starRange(1, starNum).map((index)=>(
                  <span
                    key={index}
                  >
                    <div className='star'>
                      &#9733;
                    </div>
                  </span>
                ))}
              </div>
            </div>
            <div className='right'>
              <div className='grid'>
                {this.starRange(1, clickNum).map((index)=>(
                  <span
                  key={index}
                >
                  <button className='number'>
                    {index}
                  </button>
                </span>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
    );
  }
}

export default App;