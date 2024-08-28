import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Button from '../../../components/Button.jsx';
import chartImg from '../../../assets/image/Chart.svg';
import IdolCard from './IdolCard.jsx';
import GenderToggleButton from './GenderToggleButton.jsx';
import VoteModal from '../../../components/modals/VoteModal.jsx';

const ThisMonthChart = () => {
    // 아이돌 데이터 get해오기
    const [IdolData, setIdolData] = useState([]);
    const [IdolGender, setIdolGender] = useState('female');
    const [IdolDataNum, setIdolDataNum] = useState(10);
    useEffect(() => {
        axios
            .get(
                `https://fandom-k-api.vercel.app/8-3/charts/${IdolGender}?gender=${IdolGender}&pageSize=${IdolDataNum}`,
            )
            .then((res) => {
                setIdolData([...res.data.idols]);
            })
            .catch((err) => {
                console.error('Idols get 오류', err);
            });
    }, [IdolDataNum, IdolGender]);
    // 버튼으로 성별 바꾸기
    const changeGender = (e) => {
        setIdolGender(e.target.value);
        setIdolDataNum(10);
    };
    // 더보기 누르면 데이터 10 추가
    const loadMoreIdolData = () => {
        setIdolDataNum(IdolDataNum + 10);
    };
    // 투표하기 모달창 열기
    const [isOpen, setIsOpen] = useState(false);
    const ViewVoteModalHandler = () => {
        setIsOpen(!isOpen);
    };

    return (
        <ChartContainer>
            <ChartHeader>
                <ChartHeaderTitle>이달의 차트</ChartHeaderTitle>
                <Button width="128" height="32" border-radius="3" onClick={() => ViewVoteModalHandler()}>
                    {isOpen === true ? <VoteModal /> : null}
                    <img src={chartImg} alt="차트이미지" />
                    <span> 차트 투표하기 </span>
                </Button>
            </ChartHeader>
            <ChartThisMonth>
                <GenderToggleButton
                    value="female"
                    currentGender={IdolGender}
                    onChange={changeGender}
                    label="이달의 여자 아이돌"
                />
                <GenderToggleButton
                    value="male"
                    currentGender={IdolGender}
                    onChange={changeGender}
                    label="이달의 남자 아이돌"
                />
            </ChartThisMonth>
            <ChartRankContainer>
                {IdolData.map((item, i) => {
                    return <IdolCard key={item.id} item={item} rank={i + 1} />;
                })}
            </ChartRankContainer>
            <ChartMoreBtn onClick={loadMoreIdolData}>더 보기</ChartMoreBtn>
        </ChartContainer>
    );
};

export default ThisMonthChart;

const ChartContainer = styled.div`
    width: 1200px;
    margin: 0 auto;
    background-color: #02000e;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const ChartHeader = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    Button {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 13px;
        padding: 2px 10px;
    }
`;
const ChartHeaderTitle = styled.div`
    font-size: 24px;
    font-weight: 700;
    line-height: 26px;
    color: #ffffff;
    line-height: 26px;
`;

const ChartThisMonth = styled.div`
    width: 100%;
    margin: 20px 0;

    button {
        width: 50%;
        height: 42px;
        padding: 12px;
        color: #ffffff;
        background-color: #ffffff1a;
        border: none;
        border-bottom: 1px solid #ffffff;
    }

    .inactive {
        width: 50%;
        height: 42px;
        padding: 12px;
        color: #828282;
        background-color: inherit;
        border: none;
    }
`;
const ChartRankContainer = styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    column-gap: 25px;
`;

const ChartMoreBtn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 326px;
    height: 42px;
    margin-top: 20px;
    color: #ffffff;
    background-color: #ffffff1a;
    border: 1px solid rgba(241, 238, 249, 0.8);
    border-radius: 6px;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
`;
