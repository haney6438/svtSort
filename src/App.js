import React, { useState } from 'react';
import './App.css';

const members = [
  '에스쿱스', '정한', '조슈아', '준', '호시',
  '원우', '우지', '디에잇', '민규', '도겸',
  '승관', '버논', '디노'
];

/*
  [핵심 아이디어]
  - 승패를 "이긴 사람 -> 진 사람" 화살표로 저장하는 방향 그래프를 만든다.
    winGraph['정한'].has('준')  ==  "정한이 준을 이겼다"
  - 1 > 2, 2 > 3 이면 1 -> 2 -> 3 으로 화살표를 따라 갈 수 있으므로
    1과 3은 직접 비교하지 않아도 1 > 3 이다. (이행성)
    => 화살표를 따라 갈 수 있는 쌍(경로가 있는 쌍)은 다시 묻지 않는다.
  - 모든 쌍의 순서가 정해지면 위상 정렬로 1위~13위를 만든다.
*/

// 멤버마다 빈 Set을 가진 그래프 만들기
const createEmptyGraph = () => {
  const graph = {};
  members.forEach((m) => {
    graph[m] = new Set();
  });
  return graph;
};

// start에서 화살표를 따라가 end에 도달할 수 있으면 true (DFS)
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

// 아직 순서가 정해지지 않은 쌍 (직접 비교했거나, 간접적으로 알 수 있는 쌍은 제외)
const getUncomparedPairs = (graph) => {
  const pairs = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];
      if (!hasPath(a, b, graph) && !hasPath(b, a, graph)) {
        pairs.push([a, b]);
      }
    }
  }
  return pairs;
};

// 다음 대결 고르기: 순서가 안 정해진 쌍 중에서 랜덤으로 선택
// - 직전 대결에 나온 멤버가 없는 쌍을 우선 선택 (같은 멤버가 연속으로 나오는 것 방지)
// - 남은 쌍이 없으면 null (= 모든 순서가 정해짐)
const pickNextPair = (graph, prevPair) => {
  const pairs = getUncomparedPairs(graph);
  if (pairs.length === 0) return null;

  const fresh = prevPair
    ? pairs.filter(([a, b]) => !prevPair.includes(a) && !prevPair.includes(b))
    : pairs;
  const pool = fresh.length > 0 ? fresh : pairs;

  const pair = pool[Math.floor(Math.random() * pool.length)];
  // 왼쪽/오른쪽 위치도 랜덤 (목록 순서가 앞선 멤버가 항상 왼쪽에 나오는 것 방지)
  return Math.random() < 0.5 ? pair : [pair[1], pair[0]];
};

// 승패 기록 추가 (기존 그래프를 바꾸지 않고 복사본에 추가)
const addMatch = (graph, winner, loser) => {
  const next = {};
  members.forEach((m) => {
    next[m] = new Set(graph[m]);
  });
  next[winner].add(loser);
  return next;
};

// 위상 정렬 (Kahn 알고리즘): 아무에게도 지지 않은 멤버부터 차례로 꺼내 순위를 만든다
const topologicalSort = (graph) => {
  const indegree = {};
  members.forEach((m) => (indegree[m] = 0));
  members.forEach((m) => {
    graph[m].forEach((loser) => indegree[loser]++);
  });

  const queue = members.filter((m) => indegree[m] === 0);
  const sorted = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);
    graph[current].forEach((next) => {
      indegree[next]--;
      if (indegree[next] === 0) queue.push(next);
    });
  }
  return sorted;
};

function App() {
  const [winGraph, setWinGraph] = useState(createEmptyGraph);
  const [currentPair, setCurrentPair] = useState(() =>
    pickNextPair(createEmptyGraph(), null)
  );
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState([]);

  const handleVote = (winner, loser) => {
    // state는 다음 렌더링에서 바뀌기 때문에, 새 그래프를 변수로 만들어 바로 사용한다
    const newGraph = addMatch(winGraph, winner, loser);
    setWinGraph(newGraph);

    const nextPair = pickNextPair(newGraph, currentPair);
    if (nextPair) {
      setCurrentPair(nextPair);
    } else {
      setResult(topologicalSort(newGraph));
      setFinished(true);
      setCurrentPair(null);
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