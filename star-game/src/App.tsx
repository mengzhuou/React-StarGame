import './App.css';
import React from "react";

interface PlayNumberProps {
  playNum: number;
  numStatus: string;
  onClick: (number: number, currentStatus: string) => void;
}

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const PlayNumber: React.FC<PlayNumberProps> = ({ playNum, numStatus, onClick }) => {
  return (
    <span>
      <button 
        className='number'
        style={{ backgroundColor: colors[numStatus as keyof typeof colors] }}
        onClick={()=> onClick(playNum, numStatus)}
      >
        {playNum}
      </button>
    </span>
  )
}

class App extends React.Component<any,any> {
  constructor(props:any){
    super(props);
    this.state = {
      starNum: this.getRandomNum(1, 9),
      clickNum: 9,
      availableNums: [1,2,3,4,5],
      candidateNums: [2,3],
    }
  }

  randomSum = () => {
    //get random sum from availableNums, max sum is 9
  }

  onNumberClick = (number: number, currentStatus: string) => {

    
    //if number is used, do nothing
    if (!this.state.availableNums.includes(number)){
      return;
    }
    
    //is number is available, can either be added or removed to candidate
    const newCandidateNums = 
      currentStatus === 'available'? 
        this.state.candidateNums.concat(number)
        :
        //candidateNums remove number
        this.state.candidateNums.filter((cn:any) => cn!== number);
        ;
    
    
    //if the sum does not match, number will be added to candidate
    if (this.sum(newCandidateNums) !== this.state.starNum){
      this.setState({ candidateNums: newCandidateNums })
    } else{
      //if number matched, 
      this.setState((prevState: any) => ({
        //add number to candidateNum
        candidateNums: [...prevState.candidateNums, number],
        //delete number from availableNums
        availableNums: prevState.availableNums.filter((num: number) => num !== number)
      }))
    }
  }

  numberStatus = (curNum: number) => {
    const curAvaNum = this.state.availableNums;
    const curCandNum = this.state.candidateNums;
    if (!curAvaNum.includes(curNum)){
      return 'used';
    }
    if (curCandNum.includes(curNum)){
      return this.candidateWrong() ? 'wrong' : 'candidate';
    }
    return 'available'
  }

  candidateWrong = () => {
    return this.sum(this.state.candidateNums) > this.state.starNum;
  }

  sum(arr: number[]): number{
    //acc: accumulator, curr: curremt
    //reduce method provide accumulated result
    return arr.reduce((acc,curr) => acc+ curr, 0) 
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
                  <PlayNumber 
                    key={index} 
                    playNum={index}
                    numStatus={this.numberStatus(index)}
                    onClick={this.onNumberClick}
                    />
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