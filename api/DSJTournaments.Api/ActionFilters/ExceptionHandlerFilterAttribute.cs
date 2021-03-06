﻿using DSJTournaments.Api.Exceptions;
using DSJTournaments.Api.Responses;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DSJTournaments.Api.ActionFilters
{
    public class ExceptionHandlerFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            if (exception == null)
            {
                return;
            }
            
            ErrorResponse errorModel;

            switch (exception)
            {
                case BadRequestException bre:
                    context.HttpContext.Response.StatusCode = 400;
                    errorModel = bre.ModelState != null
                        ? new ErrorResponse(bre.ModelState)
                        : new ErrorResponse(bre.Message);
                    break;
                    
                case NotFoundException _:
                    context.HttpContext.Response.StatusCode = 404;
                    errorModel = new ErrorResponse("Resource not found");
                    break;
                    
                default:
                    context.HttpContext.Response.StatusCode = 500;
                    errorModel = new ErrorResponse("An unhandled server error has occured");
            
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<ExceptionHandlerFilterAttribute>>();
                    logger.LogError(0, exception, exception.Message);
                    break;
            }
                
            var env = context.HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>();
            if (env.IsDevelopment() || env.IsEnvironment("Test"))
            {
                errorModel.ExceptionMessage = exception.Message;
                errorModel.ExceptionStackTrace = exception.StackTrace;
                errorModel.InnerExceptionMessage = exception?.InnerException?.Message;
            }

            context.Result = new ObjectResult(errorModel);
        }
    }
}