import styled from "styled-components";

// Styled components
export const Container = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-width: 4px, red, solid;
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2vh;
`;

export const Column = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const DateContainer = styled.h3`
  margin: 0;
  padding: 0;
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const StyledList = styled.ul`
  padding: 0;
  list-style: none;
  margin: 0;
  width: 100%;
  
`;

export const StyledListItem = styled.li`
  padding: 10px;
  background: white;
  border-radius: 5px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledSelect = styled.select`
  padding: 6px;
  /* border: 1px solid #ddd; */
  border: none;
  border-radius: 6px;
  background: #f4f4f4;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #eaeaea;
  }
`;

export const StyledIconButton2 = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 25px;
  color: #ED2431FF;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #8B121AFF;
  }
`;

export const StyledIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 25px;
  color: #007bff;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: #0056b3;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

