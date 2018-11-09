﻿using EdatTemplate.Models.Domain;
using EdatTemplate.Models.Domain.Enums;
using EdatTemplate.Models.Security;
using EdatTemplate.Models.View;
using EdatTemplate.Security;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;
using System;

namespace EdatTemplate
{
    public static class ReinforcedTypingsConfiguration
    {
        public static void Configure(ConfigurationBuilder builder)
        {
            // fluent configuration goes here
            builder.ExportAsInterfaces(new[] {
                // domain entity models
                typeof(Staff),
                typeof(Entity),
                typeof(Sample),
                // security models
                typeof(ClientToken),
                typeof(AuthProviderConfig),
                // view models
                typeof(StringRequest),
                typeof(StringResponse),
                typeof(EdatHeader),
                typeof(EdatFooter),
                typeof(DocumentMetadata),
                typeof(EmailMessage)
            }, c => c.WithPublicProperties(p => p.ForceNullable()).ExportTo("model.d.ts"));
            builder.ExportAsInterface<ApplicationRoles>().WithPublicFields(f => f.Constant()).ExportTo("model.d.ts");
            builder.ExportAsEnums(new[]
            {
                typeof(StatusCode),
            }, c => c.ExportTo("model.enums.ts"));

            // global type substitutions
            builder.Substitute(typeof(DateTimeOffset), new RtSimpleTypeName("string"));
            builder.Substitute(typeof(Guid), new RtSimpleTypeName("string"));
            builder.Substitute(typeof(DateTime), new RtSimpleTypeName("Date"));
            builder.Substitute(typeof(DateTime?), new RtSimpleTypeName("Date"));

            // global settings
            builder.Global(x => {
                x.CamelCaseForProperties();
                x.UseModules();
                x.ExportPureTypings();
            });
        }
    }
}