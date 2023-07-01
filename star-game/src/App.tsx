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
      availableNums: [1,2,3,4,5,6,7,8,9],
      candidateNums: [],
    }
  }

  //get random sum from availableNums, max sum is 9
  starRandomSum = (tempAvailableNums: number[]) => {
    const { availableNums } = this.state;
    let sum = 0;
    if(availableNums.length > 0){
      
      while (sum <= 9 && tempAvailableNums.length > 0) {
        const randomIndex = Math.floor(Math.random() * tempAvailableNums.length);
        const randomNum = tempAvailableNums[randomIndex];
        if (sum+randomNum <= 9){
          sum += randomNum;
          tempAvailableNums.splice(randomIndex,1);
        }
        else break;
      }
      this.setState({ starNum: sum });
    }
    return null;
  }

  onNumberClick = (number: number, currentStatus: string) => {
    const {availableNums, candidateNums, starNum} = this.state;
    if (!availableNums.includes(number)){
      return;
    }
    
    //is number is available, can either be added or removed to candidate
    const newCandidateNums = 
      currentStatus === 'available'? 
        candidateNums.concat(number)
        :
        candidateNums.filter((cn:any) => cn!== number);
        ;
    if (this.sum(newCandidateNums) !== starNum){
      this.setState({ candidateNums: newCandidateNums })
    } else{
      this.setState((prevState: any) => {
        //all candidateNum are removed from availableNums
        const updateAvailableNums = prevState.availableNums.filter(
          (num: number) => !newCandidateNums.includes(num)
        );
        return {
          candidateNums: newCandidateNums,
          availableNums: updateAvailableNums
        }
      },
      () => 
      {
        // add a delay to allow the UI to update
        setTimeout(() => {
          this.starRandomSum(availableNums);
          this.setState({ candidateNums: [] });
        }, 100);
      }
      );
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