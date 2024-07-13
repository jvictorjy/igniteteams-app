import { TextInput } from "react-native";
import styled, { css } from "styled-components/native";

export const Container = styled(TextInput).attrs(({ theme }) => ({
    placeholderTextColor: theme.COLORS.GRAY_300,
}))`
    flex: 1;

    min-height: 56px;
    max-height: 56px;

    ${({ theme }) => css`
        color: ${theme.COLORS.WHITE};
        font-size: ${theme.FONT_SIZE.MD}px;
        background-color: ${theme.COLORS.GRAY_700};
        font-family: ${theme.FONT_FAMILY.REGULAR};
    `}

    border-radius: 6px;
    padding: 16px;
`;