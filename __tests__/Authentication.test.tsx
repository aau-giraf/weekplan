import { act, renderHook, waitFor } from "@testing-library/react-native";
import { tryLogin } from "../apis/loginAPI";
import { useToast } from "../providers/ToastProvider";
import AuthenticationProvider, { useAuthentication } from "../providers/AuthenticationProvider";
import { router } from "expo-router";
import * as jwtDecode from '../utils/jwtDecode';
import * as loginAPI from '../apis/loginAPI';


jest.mock('../apis/registerAPI');
jest.mock('../apis/loginAPI');
jest.mock('expo-router', () => ({
    router:{
        replace: jest.fn(),
    }
}));

jest.mock('../providers/ToastProvider', () => ({
    useToast: jest.fn(),
}));

describe('AuthenticationProvider and useAuthentication', () => {
    const addToast = jest.fn();

    beforeEach(() => {
        (useToast as jest.Mock).mockReturnValue({ addToast });
        jest.clearAllMocks();
    });

    it('should login and store a jwt token', async () => {
        const mockToken = 'mockToken';
        (tryLogin as jest.Mock).mockResolvedValueOnce({token: mockToken});

        const {result} = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
          });

        act(() => {
            result.current.login('cap@email.dk', '29328eWee2');
        })
        
        await waitFor(()=> {
            expect (result.current.jwt).toBe(mockToken);
        })
        
        expect (router.replace).toHaveBeenCalledWith('/weekplanscreen');
    });

    it('should add a toast if login fails', async () => {
        const error = new Error('Login failed');
        (tryLogin as jest.Mock).mockRejectedValueOnce(error);

        const {result} = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
          });

        act(() => {
            result.current.login('cap@3232.dk', '23943We343')
        });

        await waitFor(() => {
            expect(addToast).toHaveBeenCalledWith({message: error.message, type: 'error'})
        });

        expect(router.replace).not.toHaveBeenCalled();
    })

    it('should register a user', async () => {
        const {result} = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
          });

        act(() => {
            result.current.register('test@test.dk','testTest1', 'Test', 'Test');
        });

        await waitFor(() => {
            expect(router.replace).toHaveBeenCalledWith('/login');
        });

        expect(addToast).not.toHaveBeenCalled();
    });

    it('should add a toast if register fails', async () => {
        const error = new Error('Register failed');
        jest.spyOn(require('../apis/registerAPI'), 'createUserRequest').mockRejectedValueOnce(error);
    
        const mockAddToast = jest.fn();
        jest.spyOn(require('../providers/ToastProvider'), 'useToast').mockReturnValue({
            addToast: mockAddToast,
        });
    
        const { result } = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
        });
    
        await act(async () => {
            await result.current.register('test@test.dk', 'testTest1', 'Test', 'Test');
        });
    
        await waitFor(() => {
            expect(mockAddToast).toHaveBeenCalledWith({ message: error.message, type: 'error' });
        });
    
        expect(router.replace).not.toHaveBeenCalled();
    });
    

    it('should return false for isAuthenticated if jwt is not set', async () => {
        const { result } = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
        });
    
        expect(result.current.isAuthenticated()).toBe(false);
    });    

    it('should return false for isAuthenticated if jwt is expired', async () => {
        jest.spyOn(require('../utils/jwtDecode'), "isTokenExpired").mockReturnValueOnce(true);

        const { result } = renderHook(() => useAuthentication(), {
            wrapper: AuthenticationProvider,
        });
        
        await act(async () => {
            result.current.login('test@test.dk', 'testTest1');
        });
    
        expect(result.current.isAuthenticated()).toBe(false);
    });
});