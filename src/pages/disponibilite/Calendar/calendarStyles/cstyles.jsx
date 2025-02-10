import styled from "styled-components";

export const CalendarContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  height: 50vh;
`;

export const MonthContainer = styled.div`
  margin-bottom: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const DaysOfWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-weight: bold;
  margin-bottom: 5px;
  background-color: #F9FAFB;
  justify-content: center;
  align-items: center;
`;

export const DaysContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  
`;  


export const Day = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 20%;
  cursor: ${({ isPast }) => (isPast ? "default" : "pointer")};
  background: ${({ isSelected, hasAvailability, isPast }) =>
    isPast
      ? "#f0f0f0" // Fond gris pour les jours passés
      : isSelected
      ? "#007BFF"
      : hasAvailability
      ? "#D3D3D3"
      : "transparent"};
  color: ${({ isSelected, hasAvailability, isPast }) =>
    isPast ? "#aaa" : isSelected || hasAvailability ? "white" : "black"};
  border: ${({ isSelected, isPast }) =>
    isPast ? "1px solid #ccc" : isSelected ? "2px solid #007BFF" : "none"};
  position: relative;
  
  ${({ isPast }) =>
    isPast &&
    `
    pointer-events: none; // Désactiver le clic
    &::after {
      content: "";
      position: absolute;
      width: 80%;
      height: 2px;
      background: #D3D3D3;
      top: 50%;
      left: 10%;
      transform: translateY(-50%);
    }
  `}
`;


export const EmptyDay = styled.div`
  width: 35px;
  height: 35px;
  visibility: hidden;
`;

export const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background: #F9FAFB;
  color: #2e2f2fff;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background: #0056b3;
  }
`;

export const TitleMonth = styled.h3`
  display: flex;
  background-color: #F9FAFB;
  width: 60%;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
`;