from fastapi.responses import Response

ACCESS_TOKEN_COOKIE_NAME = "access_token"

def set_access_token_cookie(response: Response, token: str):
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    return response


def clear_access_token(response: Response):
    response.delete_cookie(
        key=ACCESS_TOKEN_COOKIE_NAME,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )
