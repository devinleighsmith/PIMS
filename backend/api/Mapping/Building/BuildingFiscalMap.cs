using Mapster;
using Model = Pims.Api.Models.Building;
using Entity = Pims.Dal.Entities;
using System;

namespace Pims.Api.Mapping.Building
{
    public class BuildingFiscalMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.BuildingFiscal, Model.BuildingFiscalModel>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Entity.BaseEntity, Models.BaseModel>();


            config.NewConfig<Model.BuildingFiscalModel, Entity.BuildingFiscal>()
                .IgnoreNonMapped(true)
                .EnumMappingStrategy(EnumMappingStrategy.ByName)
                .Map(dest => dest.BuildingId, src => src.BuildingId)
                .Map(dest => dest.FiscalYear, src => src.FiscalYear)
                .Map(dest => dest.Key, src => src.Key)
                .Map(dest => dest.Value, src => src.Value)
                .Map(dest => dest.Note, src => src.Note)
                .Inherits<Models.BaseModel, Entity.BaseEntity>();
        }
    }
}