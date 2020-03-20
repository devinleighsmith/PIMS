using System.Threading.Tasks;
using Pims.Keycloak.Exceptions;

namespace Pims.Keycloak
{
    /// <summary>
    /// KeycloakAdmin class, provides a service for sending HTTP requests to the keycloak admin API.
    ///     - https://www.keycloak.org/docs-api/5.0/rest-api/index.html#_overview
    /// </summary>
    public partial class KeycloakAdmin : IKeycloakAdmin
    {
        #region Methods
        /// <summary>
        /// Clear any user login failures for all users This can release temporary disabled users
        /// </summary>
        /// <returns></returns>
        public async Task DeleteAttackDetectionAsync()
        {
            var response = await _client.DeleteAsync($"{_client.Options.Admin.Authority}/attack-detection/brute-force/users");

            if (!response.IsSuccessStatusCode)
                throw new KeycloakRequestException(response);
        }
        #endregion
    }
}