namespace InsurancePolicy.Extensions;

public static class CustomRouteHandlerBuilder
{
    public static RouteHandlerBuilder Validate<T>(this RouteHandlerBuilder builder, bool firstErrorOnly = false)
    { 
        builder.AddEndpointFilter(async (invocationContext, next) =>
        {
            var argument = invocationContext.Arguments.OfType<T>().FirstOrDefault();
            var response = argument.DataAnnotationsValidate();

            if (!response.IsValid)
            {
                return Results.BadRequest(firstErrorOnly ? response.Results.FirstOrDefault() : response.Results);
            }

            return await next(invocationContext);
        });

        return builder;
    }
}
