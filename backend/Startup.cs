using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BackendApi.Data;
using BackendApi.Helpers.Authorization;
using BackendApi.Membership;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace BackendApi
{
    /// <summary>
    /// Startup class, provides a way to startup the .netcore RESTful API and configure it.
    /// </summary>
    public class Startup
    {
        #region Properties
        /// <summary>
        /// get/set - The configuration for the application.
        /// </summary>
        /// <value></value>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// get/set - The environment settings for the application.
        /// </summary>
        /// <value></value>
        public IWebHostEnvironment Environment { get; }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instances of a Startup class.
        /// </summary>
        /// <param name="configuration"></param>
        /// <param name="env"></param>
        public Startup (IConfiguration configuration, IWebHostEnvironment env)
        {
            this.Configuration = configuration;
            this.Environment = env;
        }
        #endregion

        #region Methods
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services)
        {
            services.AddControllers ();

            var key = Encoding.ASCII.GetBytes (Configuration["Keycloak:Secret"]);
            services.AddAuthentication (options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer (options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.Authority = Configuration["Keycloak:Authority"];
                    options.Audience = Configuration["Keycloak:Audience"];
                    options.SaveToken = true;
                    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters ()
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey (key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    options.Events = new JwtBearerEvents ()
                    {
                        OnTokenValidated = context =>
                            {
                                return Task.CompletedTask;
                            },
                            OnAuthenticationFailed = context =>
                            {
                                context.NoResult ();
                                context.Response.StatusCode = 500;
                                context.Response.ContentType = "text/plain";
                                if (Environment.IsDevelopment ())
                                {
                                    return context.Response.WriteAsync (context.Exception.ToString ());
                                }
                                return context.Response.WriteAsync ("An error occurred processing your authentication.");
                            },
                            OnForbidden = context =>
                            {
                                return Task.CompletedTask;
                            }
                    };
                });

            services.AddAuthorization (options =>
            {
                options.AddPolicy ("Administrator", policy => policy.Requirements.Add (new RealmAccessRoleRequirement ("administrator")));
            });

            services.AddDbContext<GeoSpatialContext> (options =>
            {
                options.UseNpgsql (Configuration.GetConnectionString ("GeoSpatial"));

                // var context = new GeoSpatialContext (options.Options);
                // context.Database.EnsureCreated ();
            });

            services.AddHttpClient ();

            services.AddSingleton<IAuthorizationHandler, RealmAccessRoleHandler> ();
            services.AddTransient<IClaimsTransformation, KeyCloakClaimTransformer> ();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment ())
            {
                app.UseDatabaseErrorPage ();
                app.UseDeveloperExceptionPage ();

                UpdateDatabase (app);
            }
            else
            {
                app.UseExceptionHandler ("/Error");
            }

            app.UseHttpsRedirection ();

            app.UseRouting ();
            app.UseCors ();

            app.UseAuthentication ();
            app.UseAuthorization ();

            app.Use (async (context, next) =>
            {
                // if (context.User != null && context.User.Identity.IsAuthenticated) {
                //     context.User.Claims.Append (new Claim ("Role", "Administrator"));
                // }

                var requestPath = context.Request.Path;
                var poweredBy = context.Request.Headers["x-powered-by"];
                var bearer = context.Request.Headers["Authorization"];
                await next ();
            });

            app.UseEndpoints (endpoints =>
            {
                endpoints.MapControllers ();
            });
        }

        /// <summary>
        /// Intialize the database when the application starts.
        /// This isn't an ideal way to do this, but will work for our purposes.
        /// </summary>
        /// <param name="app"></param>
        private static void UpdateDatabase (IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory> ()
                .CreateScope ())
            {
                using (var context = serviceScope.ServiceProvider.GetService<GeoSpatialContext> ())
                {
                    context.Database.Migrate ();
                }
            }
        }
        #endregion
    }
}
