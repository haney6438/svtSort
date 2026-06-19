// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// // // 페이지 컴포넌트 불러오기
// // import Main from "./pages/Main";
// // import Sub from "./pages/Sub";

// // function App() {
// //   return (
// //     <Router>
// //       <nav style={{ padding: "10px", background: "#f5f5f5" }}>
// //         <Link to="/" style={{ marginRight: "10px" }}>메인</Link>
// //         <Link to="/sub">서브</Link>
// //       </nav>

// //       <Routes>
// //         <Route path="/" element={<Main />} />
// //         <Route path="/sub" element={<Sub />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;

// // src/App.js
// import React, { useState, useEffect } from 'react';
// import './App.css';

// const members = [
//     '에스쿱스', '정한', '조슈아', '준', '호시',
//     '원우', '우지', '디에잇', '민규', '도겸',
//     '승관', '버논', '디노'
//   ];
// // const members = ['에스쿱스', '정한', '조슈아'];

// function App() {
//   const [winGraph, setWinGraph] = useState({});
//   const [loseGraph, setLoseGraph] = useState({});
//   const [currentPair, setCurrentPair] = useState(null);
//   const [finished, setFinished] = useState(false);
//   const [result, setResult] = useState([]);

//   useEffect(() => {
//     const initGraph = () => {
//       const win = {};
//       const lose = {};
//       members.forEach((m) => {
//         win[m] = new Set();
//         lose[m] = new Set();
//       });
//       setWinGraph(win);
//       setLoseGraph(lose);
//     };
//     initGraph();
//   }, []);

//   useEffect(() => {
//     if (Object.keys(winGraph).length > 0) nextMatch();
//   }, [winGraph]);

//   const hasPath = (start, end, graph) => {
//     const visited = new Set();
//     const stack = [start];
//     while (stack.length > 0) {
//       const node = stack.pop();
//       if (node === end) return true;
//       if (!visited.has(node)) {
//         visited.add(node);
//         graph[node].forEach((n) => stack.push(n));
//       }
//     }
//     return false;
//   };

//   const getUncomparedPairs = () => {
//     const pairs = [];
//     for (let i = 0; i < members.length; i++) {
//       for (let j = i + 1; j < members.length; j++) {
//         const a = members[i],
//           b = members[j];
//         if (!hasPath(a, b, winGraph) && !hasPath(b, a, winGraph)) {
//           pairs.push([a, b]);
//         }
//       }
//     }
//     return pairs;
//   };

//   const addMatch = (winner, loser) => {
//     const newWinGraph = { ...winGraph };
//     const newLoseGraph = { ...loseGraph };
//     newWinGraph[winner] = new Set([...newWinGraph[winner], loser]);
//     newLoseGraph[loser] = new Set([...newLoseGraph[loser], winner]);
//     setWinGraph(newWinGraph);
//     setLoseGraph(newLoseGraph);
//   };

//   const topologicalSort = () => {
//     const indegree = {};
//     members.forEach((m) => (indegree[m] = 0));
//     members.forEach((m) => {
//       winGraph[m].forEach((l) => indegree[l]++);
//     });
//     const queue = members.filter((m) => indegree[m] === 0);
//     const result = [];
//     while (queue.length > 0) {
//       const current = queue.shift();
//       result.push(current);
//       winGraph[current].forEach((next) => {
//         indegree[next]--;
//         if (indegree[next] === 0) queue.push(next);
//       });
//     }
//     return result;
//   };

//   const nextMatch = () => {
//     const pairs = getUncomparedPairs();
//     if (pairs.length === 0) {
//       setResult(topologicalSort());
//       setFinished(true);
//       return;
//     }
//     const pair = pairs[Math.floor(Math.random() * pairs.length)];
//     setCurrentPair(pair);
//   };

//   const handleVote = (winner, loser) => {
//     addMatch(winner, loser);
//     setTimeout(() => nextMatch(), 0);
//   };

//   return (
//     <div style={{ textAlign: 'center', padding: '40px' }}>
//       <h1>세븐틴 소트</h1>
//       {!finished && currentPair && (
//         <>
//           <p
//             style={{
//               fontFamily: 'S-CoreDream-3Light',
//               fontSize: '14px',
//               color: 'gray',
//               marginBottom: '50px',
//             }}
//           >
//             choose the better one
//           </p>
//           <div className="button-group" style={{ marginTop: '20px' }}>
//             <button
//               id="btn1"
//               style={buttonStyle}
//               onClick={() => handleVote(currentPair[0], currentPair[1])}
//             >
//               {currentPair[0]}
//             </button>
//             <button
//               id="btn2"
//               style={buttonStyle}
//               onClick={() => handleVote(currentPair[1], currentPair[0])}
//             >
//               {currentPair[1]}
//             </button>
//           </div>
//         </>
//       )}
//       {finished && (
//         <div style={{ padding: '0 80px' }}>
//           <p
//             style={{
//               fontFamily: 'S-CoreDream-3Light',
//               fontSize: '14px',
//               color: 'gray',
//               marginBottom: '50px',
//             }}
//           >
//             result
//           </p>
//           <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
//   {result.map((name, i) => (
//     <li
//       key={i}
//       style={{
//         position: 'relative',
//         padding: '4px 0',
//         textAlign: 'center',
//         marginBottom: '4px',
//       }}
//     >
//       {/* 왼쪽에 순위 텍스트 */}
//       <span
//         style={{
//           position: 'absolute',
//           left: 0,
//           marginRight:32,
//           fontWeight: 'bold',
//           color: i < 3 ? '#F7CAC9' : '#8DA4D0',
//         }}
//       >
//         {i + 1}위
//       </span>

//       {/* 가운데에 이름 */}
//       <span>{name}</span>
//     </li>
//   ))}
// </ul>

//         </div>
//       )}
//     </div>
//   );
// }

// const buttonStyle = {
//   width: '120px',
//   height: '120px',
//   padding: '4px 10px',
//   margin: '10px',
//   fontSize: '16px',
//   backgroundColor: 'white',
//   borderRadius: '30px',
//   textAlign: 'center',
//   cursor: 'pointer',
// };

// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

const members = [
  '에스쿱스', '정한', '조슈아', '준', '호시',
  '원우', '우지', '디에잇', '민규', '도겸',
  '승관', '버논', '디노'
];

function App() {
  const [winGraph, setWinGraph] = useState({});
  const [loseGraph, setLoseGraph] = useState({});
  const [currentPair, setCurrentPair] = useState(null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const initGraph = () => {
      const win = {};
      const lose = {};
      members.forEach((m) => {
        win[m] = new Set();
        lose[m] = new Set();
      });
      setWinGraph(win);
      setLoseGraph(lose);
    };
    initGraph();
  }, []);

  useEffect(() => {
    if (Object.keys(winGraph).length > 0) {
      nextMatch();
    }
  }, [winGraph]);

  const hasPath = (start, end, graph) => {
    const visited = new Set();
    const stack = [start];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === end) return true;
      if (!visited.has(node)) {
        visited.add(node);
        graph[node].forEach((n) => stack.push(n));
      }
    }
    return false;
  };

  const addMatch = (winner, loser) => {
    // 깊은 복사
    const newWinGraph = {};
    const newLoseGraph = {};
    for (const key of Object.keys(winGraph)) {
      newWinGraph[key] = new Set(winGraph[key]);
      newLoseGraph[key] = new Set(loseGraph[key]);
    }

    newWinGraph[winner].add(loser);
    newLoseGraph[loser].add(winner);

    setWinGraph(newWinGraph);
    setLoseGraph(newLoseGraph);
  };

  const topologicalSort = () => {
    const indegree = {};
    members.forEach((m) => (indegree[m] = 0));
    members.forEach((m) => {
      winGraph[m].forEach((l) => indegree[l]++);
    });
    const queue = members.filter((m) => indegree[m] === 0);
    const sortedResult = [];
    while (queue.length > 0) {
      const current = queue.shift();
      sortedResult.push(current);
      winGraph[current].forEach((next) => {
        indegree[next]--;
        if (indegree[next] === 0) queue.push(next);
      });
    }
    return sortedResult;
  };

  // 완전히 랜덤한 두명 뽑기, 직전 대결 멤버는 제외 (중복 방지)
  const nextMatch = () => {
    if (finished) return;

    let first, second;
    do {
      first = members[Math.floor(Math.random() * members.length)];
      second = members[Math.floor(Math.random() * members.length)];
    } while (
      first === second || 
      (currentPair && (
        first === currentPair[0] || first === currentPair[1] ||
        second === currentPair[0] || second === currentPair[1]
      ))
    );

    setCurrentPair([first, second]);
  };

  const handleVote = (winner, loser) => {
    addMatch(winner, loser);

    // 전체 대결이 끝났는지 체크
    const totalMatches = (members.length * (members.length -1)) / 2;
    let playedMatches = 0;
    members.forEach(m => playedMatches += winGraph[m].size);
    // addMatch 비동기 업데이트 고려해서 +1 해주기
    playedMatches += 1;

    if (playedMatches >= totalMatches) {
      const sorted = topologicalSort();
      setResult(sorted);
      setFinished(true);
      setCurrentPair(null);
    } else {
      setTimeout(() => nextMatch(), 0);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>세븐틴 소트</h1>
      {!finished && currentPair && (
        <>
          <p
            style={{
              fontFamily: 'S-CoreDream-3Light',
              fontSize: '14px',
              color: 'gray',
              marginBottom: '50px',
            }}
          >
            choose the better one
          </p>
          <div className="button-group" style={{ marginTop: '20px' }}>
            <button
              style={buttonStyle}
              onClick={() => handleVote(currentPair[0], currentPair[1])}
            >
              {currentPair[0]}
            </button>
            <button
              style={buttonStyle}
              onClick={() => handleVote(currentPair[1], currentPair[0])}
            >
              {currentPair[1]}
            </button>
          </div>
        </>
      )}
      {finished && (
        <div style={{ padding: '0 80px' }}>
          <p
            style={{
              fontFamily: 'S-CoreDream-3Light',
              fontSize: '14px',
              color: 'gray',
              marginBottom: '50px',
            }}
          >
            result
          </p>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {result.map((name, i) => (
              <li
                key={i}
                style={{
                  position: 'relative',
                  padding: '4px 0',
                  textAlign: 'center',
                  marginBottom: '4px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    marginRight: 32,
                    fontWeight: 'bold',
                    color: i < 3 ? '#F7CAC9' : '#8DA4D0',
                  }}
                >
                  {i + 1}위
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  width: '120px',
  height: '120px',
  padding: '4px 10px',
  margin: '10px',
  fontSize: '16px',
  backgroundColor: 'white',
  borderRadius: '30px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default App;
