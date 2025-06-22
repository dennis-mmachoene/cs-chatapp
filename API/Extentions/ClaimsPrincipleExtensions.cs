using System.Security.Claims;

namespace API.Extension
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("Cannot get uset");
        }

        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            return Guid.Parse(
                user.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? throw new Exception("Cannot get user id")
            );
        }
    }
}
