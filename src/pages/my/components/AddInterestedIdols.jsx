import { useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import IdolProfile from './IdolProfile';
import Button from '../../../components/Button';
import plusIcon from '../../../assets/icon/Icon-plus.svg';
import arrowIcon from '../../../assets/icon/Icon-arrow.svg';
import { MyDispatchContext, MyStateContext } from '../MyPage';
import useItemsPerPage from '../../../hooks/my/useItemsPerPage';

const AddInterestedIdols = ({ cursor, setCursor, isLoading, loadMore, option, setOption }) => {
    const { datas, selectedDatas, checkedIdols } = useContext(MyStateContext);
    const { setSelectedDatas, setCheckedIdols } = useContext(MyDispatchContext);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 관리함.
    const itemsPerPage = useItemsPerPage(); // 페이지당 렌더링되어야 할 아이템 수를 가져옴.
    const lastItemRef = useRef(null); // 마지막 아이템을 참조하는 ref.
    const idolListRef = useRef(null); // IdolList의 ref.

    // 옵션 변경 시 호출되는 함수
    const handleChange = (e) => {
        setOption(e.target.value); // 옵션을 업데이트함.
        setCurrentPage(1); // 페이지를 1로 초기화.
        setCursor(null); // 커서를 초기화.
        setCheckedIdols([]); // 체크된 아이돌을 초기화.
    };

    // '추가하기' 버튼 클릭 시 호출되는 함수
    const handleAddClick = () => {
        if (!checkedIdols.length) return;
        setSelectedDatas([...selectedDatas, ...checkedIdols]); // 선택된 아이돌을 추가함.
        setCheckedIdols([]); // 체크된 아이돌을 초기화.
    };

    // 아이돌 체크 상태 변경 시 호출되는 함수
    const handleCheck = (idol, checked) => {
        if (checked) {
            setCheckedIdols([...checkedIdols, idol]); // 체크된 아이돌을 추가.
        } else {
            setCheckedIdols(checkedIdols.filter((checkedIdol) => checkedIdol.id !== idol.id)); // 체크 해제된 아이돌을 제거.
        }
    };

    // 관심 목록에 있는 데이터를 제외하고 정렬된 데이터를 생성함.
    const sortedDatas = useMemo(() => {
        if (!datas || datas.length === 0) return [];

        console.log(datas.length);
        return datas.filter((item) => !selectedDatas.some((selected) => selected.id === item.id));
    }, [datas, option, selectedDatas]);

    const scrollTo = (direction) => {
        if (!idolListRef.current) return;

        const scrollAmount = idolListRef.current.offsetWidth + 24;
        idolListRef.current.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        });
    };

    // 데이터를 더 로드하는 함수
    const loadMoreDatas = useCallback(() => {
        if (isLoading || !cursor || !lastItemRef.current) return;

        const observerInstance = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMore(itemsPerPage, option);

                    // loadMore 호출 후 관찰 중지
                    if (lastItemRef.current) {
                        observerInstance.unobserve(lastItemRef.current);
                    }
                }
            },
            { threshold: 0.5 },
        );

        if (lastItemRef.current) {
            observerInstance.observe(lastItemRef.current);
        }

        return () => {
            observerInstance.disconnect(); // 옵저버를 해제.
        };
    }, [isLoading, cursor, itemsPerPage, option, loadMore]);

    useEffect(() => {
        loadMoreDatas();
    }, [loadMoreDatas]);

    // 다음 페이지로 이동하는 함수
    const handleNextPage = () => {
        scrollTo('next');
        setCurrentPage(currentPage + 1); // 현재 페이지를 증가.
    };

    // 이전 페이지로 이동하는 함수
    const handlePrevPage = () => {
        scrollTo('prev');
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); // 현재 페이지를 감소.
        }
    };

    // 성별 필터 버튼 배열
    const genderBtnArr = [
        { value: 'total', option: 'total', title: '전체 아이돌' },
        { value: 'female', option: 'female', title: '여자 아이돌' },
        { value: 'male', option: 'male', title: '남자 아이돌' },
    ];

    // 더 이상 로드할 데이터가 없는지 판단하는 변수.
    const isDisabled = !cursor && currentPage * itemsPerPage >= sortedDatas.length;

    return (
        <ContentWrapper>
            <ContentTitle>
                <h2>관심 있는 아이돌을 추가해보세요.</h2>
                <ContentNav>
                    {genderBtnArr.map((gender) => (
                        <GenderToggleButton
                            key={gender.value}
                            onClick={handleChange}
                            value={gender.value}
                            selected={option === gender.option}
                        >
                            {gender.title}
                        </GenderToggleButton>
                    ))}
                </ContentNav>
            </ContentTitle>

            <CarouselPage>
                <CarouselButton onClick={handlePrevPage} disabled={isLoading || currentPage === 1}>
                    <img src={arrowIcon} alt="이전" />
                </CarouselButton>
                <IdolList ref={idolListRef}>
                    {sortedDatas.map((idol, index) => (
                        <IdolProfile
                            key={idol.id}
                            idol={idol}
                            onCheck={handleCheck}
                            checked={checkedIdols.some((checkedIdol) => checkedIdol.id === idol.id)}
                            ref={index === sortedDatas.length - 1 ? lastItemRef : null}
                        />
                    ))}
                </IdolList>

                <CarouselButton onClick={handleNextPage} disabled={isLoading || isDisabled}>
                    <RotatedIcon src={arrowIcon} alt="다음" />
                </CarouselButton>
            </CarouselPage>
            <Button onClick={handleAddClick} width="255" height="48" radius="24">
                <ButtonInner>
                    <img src={plusIcon} alt="추가" />
                    <span>추가하기</span>
                </ButtonInner>
            </Button>
        </ContentWrapper>
    );
};

export default AddInterestedIdols;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 81px;

    @media (max-width: 1280px) {
        padding: 0 24px;
    }
`;

const ContentTitle = styled.div`
    width: 100%;
    max-width: 1194px;
    padding-top: 40px;
    display: flex;
    flex-direction: column;

    @media (max-width: 1280px) {
        max-width: 696px;
    }
    @media (max-width: 768px) {
        max-width: 328px;
    }
`;

const ContentNav = styled.div`
    width: 100%;
    max-width: 1194px;
    height: 42px;
    margin-top: 30px;
    display: flex;
    flex-direction: row;

    @media (max-width: 1280px) {
        max-width: 680px;
    }
    @media (max-width: 768px) {
        max-width: 328px;
    }
`;

const GenderToggleButton = styled.button`
    flex: 1;
    text-align: center;
    background-color: ${(props) => (props.selected === false ? '#02000e' : '#ffffff1a')};
    padding: 12px;
    border: none;
    border-bottom: ${(props) => (props.selected === false ? 'none' : '1px solid #fff')};

    font-size: 14px;
    line-height: 18px;
    color: ${(props) => (props.selected === false ? '#828282' : '#fff')};
`;

const CarouselPage = styled.div`
    width: 100%;
    max-width: 1316px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 32px;
    margin: 32px 0 48px;

    @media (max-width: 1280px) {
        max-width: 696px;
        gap: 27px;
    }
    @media (max-width: 768px) {
        max-width: 328px;
    }
`;

const CarouselButton = styled.button`
    width: 29px;
    height: 135px;
    border-radius: 4px;
    border: none;
    background-color: #1b1b1bcc;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const RotatedIcon = styled.img`
    transform: scaleX(-1);
`;

const IdolList = styled.div`
    display: grid;
    grid-template: 1fr 1fr / repeat(8, 128px);
    gap: 24px;
    place-items: center;
    justify-content: start;
    margin: 0 auto;

    overflow-y: hidden;
    overflow-x: hidden;
    grid-auto-flow: column;
    width: 1194px;
    padding: 0px 1px;
    height: 398px;
    margin: 0;

    @media (max-width: 1280px) {
        grid-template-columns: repeat(4, 128px);

        width: 584px;
        height: 390px;
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(3, 98px);
        grid-column-gap: 17px;

        width: 328px;
        height: 326px;
        overflow-x: scroll;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ButtonInner = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    line-height: 26px;
    gap: 8px;

    img {
        width: 24px;
        height: 24px;
    }
`;
