using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DiagnosticAdapter;
using NLog;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;
using System.Text.RegularExpressions;

namespace d6loa.ORM
{
    public class NLogSqlInterceptor
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static readonly IList<string> Commands = new List<string>();
        private static readonly IList<string> Declares = new List<string>();

        private static readonly object Lock = new object();

        private readonly EntityFrameworkConfig _entityFrameworkConfig;

        public NLogSqlInterceptor(EntityFrameworkConfig entityFrameworkConfig)
        {
            _entityFrameworkConfig = entityFrameworkConfig;
        }

        [DiagnosticName("Microsoft.EntityFrameworkCore.Database.Command.CommandExecuting")]
        public void OnCommandExecuting(DbCommand command, DbCommandMethod executeMethod, Guid commandId, Guid connectionId, bool async, DateTimeOffset startTime)
        {
            Log(command);
        }

        [DiagnosticName("Microsoft.EntityFrameworkCore.Database.Command.CommandExecuted")]
        public void OnCommandExecuted(object result, bool async)
        {

        }

        private void Log(DbCommand command)
        {
            //this method creates an executable SQL script (Logs/sql.log) for DBAs to review the SQL of the application
            var sb = new StringBuilder();
            var commandText = $"{command.CommandText} ";
            if (_entityFrameworkConfig.DeduplicateLoggedCommands)
            {
                lock (Lock)
                {
                    if (Commands.Contains(commandText))
                    {
                        return;
                    }
                    Commands.Add(commandText);
                }
            }
            if (command.Parameters.Count > 0)
            {
                sb.AppendLine("--Parameters:");
            }

            foreach (DbParameter param in command.Parameters)
            {
                var sqlParam = (SqlParameter)param;
                var parameterType = sqlParam.SqlDbType.ToString().ToLower();
                var parameterName = $"@P{Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "")}";
                commandText = commandText.Replace($" {sqlParam.ParameterName} ", $" {parameterName} ");
                commandText = commandText.Replace($" {sqlParam.ParameterName}{Environment.NewLine}", $" {parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($" {sqlParam.ParameterName},", $" {parameterName},");
                commandText = commandText.Replace($",{sqlParam.ParameterName} ", $",{parameterName} ");
                commandText = commandText.Replace($",{sqlParam.ParameterName}{Environment.NewLine}", $",{parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($",{sqlParam.ParameterName},", $",{parameterName},");
                commandText = commandText.Replace($"({sqlParam.ParameterName} ", $"({parameterName} ");
                commandText = commandText.Replace($"({sqlParam.ParameterName}{Environment.NewLine}", $"({parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($"({sqlParam.ParameterName},", $"({parameterName},");
                commandText = commandText.Replace($" {sqlParam.ParameterName})", $" {parameterName})");
                commandText = commandText.Replace($",{sqlParam.ParameterName})", $",{parameterName})");
                commandText = commandText.Replace($" {sqlParam.ParameterName};", $" {parameterName};");
                commandText = commandText.Replace($",{sqlParam.ParameterName};", $",{parameterName};");
                //
                commandText = commandText.Replace($" @{sqlParam.ParameterName} ", $" {parameterName} ");
                commandText = commandText.Replace($" @{sqlParam.ParameterName}{Environment.NewLine}", $" {parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($" @{sqlParam.ParameterName},", $" {parameterName},");
                commandText = commandText.Replace($",@{sqlParam.ParameterName} ", $",{parameterName} ");
                commandText = commandText.Replace($",@{sqlParam.ParameterName}{Environment.NewLine}", $",{parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($",@{sqlParam.ParameterName},", $",{parameterName},");
                commandText = commandText.Replace($"(@{sqlParam.ParameterName} ", $"({parameterName} ");
                commandText = commandText.Replace($"(@{sqlParam.ParameterName}{Environment.NewLine}", $"({parameterName}{Environment.NewLine}");
                commandText = commandText.Replace($"(@{sqlParam.ParameterName},", $"({parameterName},");
                commandText = commandText.Replace($" @{sqlParam.ParameterName})", $" {parameterName})");
                commandText = commandText.Replace($",@{sqlParam.ParameterName})", $",{parameterName})");
                commandText = commandText.Replace($" @{sqlParam.ParameterName};", $" {parameterName};");
                commandText = commandText.Replace($",@{sqlParam.ParameterName};", $",{parameterName};");
                sb.AppendLine($"declare {parameterName} {parameterType} {(sqlParam.Size > 0 ? "(" + sqlParam.Size + ")" : "")}");
                if (sqlParam.SqlValue.ToString().ToLower() == "null")
                {
                    sb.AppendLine($"set {parameterName} = NULL");
                }
                else
                {
                    sb.AppendLine($"set {parameterName} = '{sqlParam.SqlValue}'");
                }
            }
            if (command.Parameters.Count > 0)
            {
                sb.AppendLine(Environment.NewLine);
            }
            sb.AppendLine($"--Query:{Environment.NewLine}{commandText}");
            sb.AppendLine(Environment.NewLine);
            Logger.Info(sb.ToString());
        }
    }
}
