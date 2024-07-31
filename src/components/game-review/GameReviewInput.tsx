import { useEffect, useState } from 'react';
import { createGameReview, updateGameReview } from '@/api/GameReviewApi';
import './GameReviewInput.css';
import { searchGameTitle } from '@/api/IgdbApi';

const GameReviewInput = (item: GameReviewInput) => {
  const [gameTitle, setGameTitle] = useState(item.gameTitle === undefined ? '' : item.gameTitle);
  const [point, setPoint] = useState(item.point);
  const [description, setDescription] = useState(item.description);
  const [gameTitleList, setGameTitleList] = useState([]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (Object.keys(item).length === 0) {
      await createGameReview({
        gameTitle,
        point,
        description,
      });
    } else {
      await updateGameReview(item.id, {
        gameTitle,
        point,
        description,
      });

      item.isEditingState(false, { gameTitle, point, description });
    }
  };

  const checkGameTitle = async () => {
    const data = await searchGameTitle(gameTitle);
    const newGameTitleList = JSON.parse(data.body).map((it: SearchGameTitle) => it.name);

    setGameTitleList(newGameTitleList);
  };

  useEffect(() => {}, [gameTitle, point, description]);
  useEffect(() => {
    if (gameTitleList.length !== 0) {
      window.alert(`등록 가능한 게임 제목 \n ${gameTitleList.join('\n ')}`);
    }
  }, [gameTitleList]);

  return (
    <div className="game-review-input-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            제목:
            <input
              className="game-title"
              type="text"
              name="title"
              onChange={(e) => setGameTitle(e.target.value)}
              value={gameTitle}
              placeholder="제목 일부를 입력 후 검색 시 등록 가능한 제목을 확인할 수 있습니다."
            />
          </label>
          <button type="button" onClick={() => checkGameTitle()}>
            검색
          </button>
          <label>
            평점:
            <select
              className="point"
              name="point"
              onChange={(e) => setPoint(e.target.value)}
              value={~~point === 0 ? 1 : ~~point}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </label>
        </div>
        <div className="direction-column">
          <label htmlFor="description" id="description">
            내용:
          </label>
          <textarea
            className="description"
            name="description"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <button type="submit">{Object.keys(item).length === 0 ? '등록' : '수정'}</button>
      </form>
    </div>
  );
};

export default GameReviewInput;

interface GameReviewInput {
  id: string;
  gameTitle: string;
  point: string;
  description: string;
  isEditingState: Function;
}

interface SearchGameTitle {
  id: number;
  name: string;
}
