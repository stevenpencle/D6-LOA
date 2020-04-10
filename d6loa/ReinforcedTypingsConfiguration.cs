using d6loa.Models.Arculus;
using d6loa.Models.Domain;
using d6loa.Models.Domain.Enums;
using d6loa.Models.Edms;
using d6loa.Models.Security;
using d6loa.Models.View;
using d6loa.Security;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;
using System;

namespace d6loa
{
    public static class ReinforcedTypingsConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            // fluent configuration goes here

            // EF MODELS
            builder.ExportAsInterfaces(new[] {
                // domain entity models
                typeof(AppUser),
                typeof(FdotAppUser),
                typeof(PublicAppUser),
                typeof(Sample),
                typeof(Contract),
                typeof(Loa),
                typeof(Vendor),
                typeof(Supplement)
            }, c => c
            .WithCodeGenerator<ReinforcedTypingsEntityInterfaceCodeGenerator>()
            .WithPublicProperties(p => p.ForceNullable())
            .ExportTo("model.d.ts")
            .DontIncludeToNamespace());

            // Other View Models
            builder.ExportAsInterfaces(new[] {
                // security models
                typeof(ClientToken),
                typeof(AuthProviderConfig),
                // arculus models
                typeof(Staff),
                typeof(StaffConnector),
                // edms models
                typeof(EdmsDocument),
                typeof(EdmsDocumentMetadata),
                typeof(EdmsDocumentVersion),
                typeof(EdmsDocumentType),
                typeof(EdmsDocumentProperty),
                // view models
                typeof(StringRequest),
                typeof(StringResponse),
                typeof(SignatureRequest),
                typeof(MapRequest),
                typeof(EdatHeader),
                typeof(EdatFooter),
                typeof(DocumentMetadata),
                typeof(EmailMessage),
                typeof(GraphDataPoint),
                typeof(GraphSeries),
                typeof(GraphData)
            }, c => c.WithPublicProperties(p => p
                .ForceNullable())
                .ExportTo("model.d.ts")
                .DontIncludeToNamespace()
                );
            builder.ExportAsInterface<ApplicationRoles>()
            .WithPublicFields(f => f.Constant())
            .ExportTo("model.d.ts")
            .DontIncludeToNamespace();

            // Enums
            builder.ExportAsEnums(new[]
            {
                typeof(AppUserType),
                typeof(StatusCode)
            }, c => c.ExportTo("model.enums.ts").DontIncludeToNamespace());

            // global type substitutions
            builder.Substitute(typeof(DateTimeOffset), new RtSimpleTypeName("string"));
            builder.Substitute(typeof(Guid), new RtSimpleTypeName("string"));
            builder.Substitute(typeof(DateTime), new RtSimpleTypeName("Date"));
            builder.Substitute(typeof(DateTime?), new RtSimpleTypeName("Date"));

            // global settings
            builder.Global(x =>
            {
                x.CamelCaseForProperties();
                x.UseModules();
            });
        }
    }
}
